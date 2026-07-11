// Band-jam sequencer: renders a JamRecipe against a SoundManifest into a stereo
// master WAV. This is the shared-clock transport — every track is placed on one
// sample-exact grid, so the same recipe + same sounds + same engineVersion give
// a bit-identical render (proven by `npm run verify`). Manifest-driven: real
// recordings replace the placeholder WAVs with zero change here.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readWav, writeWavPCM16, SAMPLE_RATE } from './wav.mjs';
import { resolveJam } from './resolver.mjs';

export { ENGINE_VERSION } from './engine-version.mjs';
import { ENGINE_VERSION } from './engine-version.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

// --- tiny dependency-free validator against a draft-07-ish subset ---
function validate(obj, schema, path = '$') {
  const errs = [];
  if (schema.required) {
    for (const key of schema.required) {
      if (obj == null || !(key in obj)) errs.push(`${path}.${key} is required`);
    }
  }
  if (schema.properties && obj && typeof obj === 'object') {
    for (const [k, sub] of Object.entries(schema.properties)) {
      if (!(k in obj)) continue;
      const v = obj[k];
      if (sub.enum && !sub.enum.includes(v)) {
        errs.push(`${path}.${k}="${v}" not in [${sub.enum.join(', ')}]`);
      }
      if (sub.type === 'object' && sub.properties) errs.push(...validate(v, sub, `${path}.${k}`));
      if (sub.type === 'array' && sub.items && Array.isArray(v)) {
        v.forEach((el, i) => errs.push(...validate(el, sub.items, `${path}.${k}[${i}]`)));
      }
    }
  }
  return errs;
}

function loadJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

// Classic Schroeder-ish reverb (4 combs + 2 allpass). Deterministic; mono in/out.
function reverb(input, sr) {
  const scale = sr / 44100;
  const combs = [1557, 1617, 1491, 1422].map((d) => Math.round(d * scale));
  const combFb = [0.805, 0.827, 0.783, 0.764];
  const allpass = [225, 556].map((d) => Math.round(d * scale));
  const out = new Float32Array(input.length);
  for (let c = 0; c < combs.length; c++) {
    const N = combs[c];
    const buf = new Float32Array(N);
    let idx = 0;
    const fb = combFb[c];
    for (let i = 0; i < input.length; i++) {
      const y = buf[idx];
      buf[idx] = input[i] + y * fb;
      idx = (idx + 1) % N;
      out[i] += y * 0.25;
    }
  }
  for (const N of allpass) {
    const buf = new Float32Array(N);
    let idx = 0;
    const g = 0.5;
    for (let i = 0; i < out.length; i++) {
      const bufOut = buf[idx];
      const y = -g * out[i] + bufOut;
      buf[idx] = out[i] + g * bufOut;
      idx = (idx + 1) % N;
      out[i] = y;
    }
  }
  return out;
}

// Equal-power pan → [gainL, gainR].
function panGains(pan) {
  const a = ((pan + 1) * Math.PI) / 4;
  return [Math.cos(a), Math.sin(a)];
}

// Each recipe track is one mono "voice" panned into the stereo field by the
// resolver's seed-driven pan (see resolver.mjs). Real recordings may arrive
// stereo (the recording brief doesn't require mono); downmix to mono here so
// every source — however many channels it was captured with — still goes
// through the exact same panning model. This only affects the render-time
// mix: the source file on disk (and its sourceHash/canonicalUri) always keeps
// its original channel count untouched.
function downmixToMono(channels) {
  if (channels.length === 1) return channels[0];
  const n = channels[0].length;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let c = 0; c < channels.length; c++) sum += channels[c][i];
    out[i] = sum / channels.length;
  }
  return out;
}

export function renderJam({ recipe, manifest, assetBase }) {
  const sr = SAMPLE_RATE;
  const samplesPerBeat = Math.round((sr * 60) / recipe.tempo);
  const masterFrames = samplesPerBeat * 4 * recipe.bars;
  const L = new Float32Array(masterFrames);
  const R = new Float32Array(masterFrames);
  const wet = new Float32Array(masterFrames);
  const byId = Object.fromEntries(manifest.sounds.map((s) => [s.id, s]));
  const log = [];

  for (const track of recipe.tracks) {
    const sound = byId[track.soundId];
    if (!sound) throw new Error(`recipe references unknown soundId "${track.soundId}"`);
    if (!recipe.memberIds.includes(track.performerArtistId)) {
      throw new Error(
        `track ${track.soundId} performerArtistId "${track.performerArtistId}" is not in recipe.memberIds`
      );
    }
    if (sound.sourceBot !== track.performerArtistId) {
      throw new Error(
        `track ${track.soundId} belongs to ${sound.sourceBot}, not performer ${track.performerArtistId}`
      );
    }
    if (sound.sonicIdentityId !== track.sonicIdentityId) {
      throw new Error(
        `track ${track.soundId} sonicIdentityId "${track.sonicIdentityId}" does not match sound's "${sound.sonicIdentityId}"`
      );
    }
    if (sound.bpm !== recipe.tempo) {
      log.push(
        `  note: ${sound.id} bpm ${sound.bpm} != recipe tempo ${recipe.tempo}; tiling at native length (time-stretch is future work)`
      );
    }
    const wavPath = resolve(assetBase, sound.playbackUri);
    if (!existsSync(wavPath)) throw new Error(`missing audio for ${sound.id}: ${wavPath}`);
    const { channels } = readWav(wavPath);
    if (channels.length > 1) {
      log.push(
        `  note: ${sound.id} source is ${channels.length}-channel; downmixed to mono for the ensemble mix`
      );
    }
    const loop = downmixToMono(channels);
    const [gL, gR] = panGains(track.pan);
    const g = track.gain;
    // Tile the loop across the whole timeline (the shared clock).
    for (let i = 0; i < masterFrames; i++) {
      const s = loop[i % loop.length] * g;
      L[i] += s * gL;
      R[i] += s * gR;
      wet[i] += s;
    }
    log.push(`  track ${sound.id} role=${track.role} gain=${g} pan=${track.pan}`);
  }

  // Reverb send → both channels (adds room/space).
  const send = recipe.mix.reverbSend;
  if (send > 0) {
    const rv = reverb(wet, sr);
    for (let i = 0; i < masterFrames; i++) {
      L[i] += rv[i] * send;
      R[i] += rv[i] * send;
    }
  }

  // Master gain + tanh soft-clip: bounded, click-free, deterministic.
  const mg = recipe.mix.masterGain;
  let peak = 0;
  for (let i = 0; i < masterFrames; i++) {
    L[i] = Math.tanh(L[i] * mg);
    R[i] = Math.tanh(R[i] * mg);
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  }
  return { channels: [L, R], sr, frames: masterFrames, peak: +peak.toFixed(4), log };
}

// --- CLI ---
function argVal(flag, def) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : def;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const intentPath = argVal('--intent', null);
  const manifestPath = resolve(
    argVal('--manifest', join(ROOT, 'manifests', 'placeholder-sounds.json'))
  );
  const outPath = resolve(argVal('--out', join(ROOT, 'out', 'jam.wav')));

  const manifest = loadJson(manifestPath);
  const manifestSchema = loadJson(join(ROOT, 'schema', 'sound-manifest.schema.json'));
  const recipeSchema = loadJson(join(ROOT, 'schema', 'jam-recipe.schema.json'));

  const manifestErrs = validate(manifest, manifestSchema, 'manifest');
  if (manifestErrs.length) {
    console.error('Schema validation failed:');
    manifestErrs.forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }

  // --intent runs the artist-aware resolver first; --recipe (default) loads a
  // hand-authored recipe directly. Either way the recipe that reaches
  // renderJam below has passed through the same jam-recipe schema gate.
  let recipe;
  if (intentPath) {
    const intent = loadJson(resolve(intentPath));
    const intentSchema = loadJson(join(ROOT, 'schema', 'jam-intent.schema.json'));
    const intentErrs = validate(intent, intentSchema, 'intent');
    if (intentErrs.length) {
      console.error('Schema validation failed:');
      intentErrs.forEach((e) => console.error('  - ' + e));
      process.exit(1);
    }
    const sonicIdentities = loadJson(join(ROOT, 'manifests', 'sonic-identities.json'));
    const artistTraits = loadJson(join(ROOT, 'manifests', 'artist-traits.json'));
    const resolved = resolveJam(intent, { soundManifest: manifest, sonicIdentities, artistTraits });
    resolved.log.forEach((l) => console.log(l));
    recipe = resolved.recipe;
  } else {
    const recipePath = resolve(argVal('--recipe', join(ROOT, 'manifests', 'demo-jam.json')));
    recipe = loadJson(recipePath);
  }

  const recipeErrs = validate(recipe, recipeSchema, 'recipe');
  if (recipeErrs.length) {
    console.error('Schema validation failed:');
    recipeErrs.forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }
  if (recipe.engineVersion !== ENGINE_VERSION) {
    console.warn(
      `  warning: recipe engineVersion ${recipe.engineVersion} != engine ${ENGINE_VERSION}; render may not be reproducible against it`
    );
  }

  const { channels, sr, frames, peak, log } = renderJam({
    recipe,
    manifest,
    assetBase: ROOT
  });
  log.forEach((l) => console.log(l));
  writeWavPCM16(outPath, channels, sr);
  console.log(`  rendered ${outPath}  ${(frames / sr).toFixed(2)}s  peak=${peak}`);
}
