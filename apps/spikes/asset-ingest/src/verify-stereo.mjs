// Regression test: real recordings may arrive stereo (the recording brief
// doesn't require mono). Assert `band-jam/src/jam.mjs` actually downmixes
// stereo sources (L+R)/2 at render time, rather than silently reading channel
// 0 only. `gen-test-intake.mjs`'s "_test-session-stereo" fixture is
// phase-inverted (R = -L), so a correct downmix renders EXACT digital silence
// and a channel-0-only bug would instead render the original, non-silent
// signal — the test discriminates cleanly between the two.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { validate } from './validate-intake.mjs';
import { renderJam, ENGINE_VERSION } from '../../band-jam/src/jam.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const BAND_JAM = resolve(ROOT, '..', 'band-jam');

function loadJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const manifestPath = join(ROOT, 'out', 'test-sound-manifest.json');
if (!existsSync(manifestPath)) {
  fail(
    `missing ${manifestPath} — run:\n` +
      '  npm run gen-test-intake\n' +
      '  node src/ingest.mjs --session intake/_test-session-stereo/session.json ' +
      '--manifest-out out/test-sound-manifest.json --identities-file out/test-sonic-identities.json'
  );
}
const manifest = loadJson(manifestPath);
const soundId = 'bassoon-chaves-signature';
const sound = manifest.sounds.find((s) => s.id === soundId);
if (!sound) fail(`expected ingested sound "${soundId}" not found in ${manifestPath}`);

const recipe = {
  bandId: 'verify-stereo',
  memberIds: [sound.sourceBot],
  seed: 1,
  tempo: sound.bpm,
  keyCenter: sound.keyCenter,
  bars: sound.bars,
  tracks: [
    {
      performerArtistId: sound.sourceBot,
      soundId: sound.id,
      sonicIdentityId: sound.sonicIdentityId,
      role: 'signature',
      patternId: 'verify-stereo',
      gain: 1,
      pan: 0
    }
  ],
  mix: { masterGain: 1, reverbSend: 0 },
  engineVersion: ENGINE_VERSION,
  sourceHashes: {}
};

const recipeSchema = loadJson(join(BAND_JAM, 'schema', 'jam-recipe.schema.json'));
const recipeErrs = validate(recipe, recipeSchema, 'recipe');
if (recipeErrs.length)
  fail('recipe failed validation:\n' + recipeErrs.map((e) => '  - ' + e).join('\n'));

const { channels } = renderJam({ recipe, manifest, assetBase: BAND_JAM });
let maxAbs = 0;
for (const ch of channels) {
  for (let i = 0; i < ch.length; i++) maxAbs = Math.max(maxAbs, Math.abs(ch[i]));
}

if (maxAbs === 0) {
  console.log(
    `✅ stereo downmix verified: phase-inverted source rendered exact silence (maxAbs=${maxAbs})`
  );
} else {
  fail(
    `❌ stereo downmix broken: expected exact silence, got maxAbs=${maxAbs} — ` +
      'jam.mjs may be reading only one channel again'
  );
}
