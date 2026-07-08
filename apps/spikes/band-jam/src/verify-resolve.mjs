// Verifies the resolver: resolveJam is itself deterministic, the full
// JamIntent -> JamRecipe -> PCM chain is deterministic, and the mapping is
// genuinely trait/vibe-driven rather than coincidental (isolates seed-derived
// fields like pan from vibe/intensity-derived fields like reverb/bars).
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveJam } from './resolver.mjs';
import { renderJam } from './jam.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const loadJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

const manifest = loadJson(join(ROOT, 'manifests', 'placeholder-sounds.json'));
const sonicIdentities = loadJson(join(ROOT, 'manifests', 'sonic-identities.json'));
const artistTraits = loadJson(join(ROOT, 'manifests', 'artist-traits.json'));
const intentDriving = loadJson(join(ROOT, 'manifests', 'demo-intent-trio-driving.json'));
const intentGritty = loadJson(join(ROOT, 'manifests', 'demo-intent-trio-gritty.json'));

const refs = { soundManifest: manifest, sonicIdentities, artistTraits };
let failures = 0;

function check(label, pass) {
  console.log(`${pass ? '✅' : '❌'} ${label}`);
  if (!pass) failures++;
}

// 1. Resolve determinism: same intent + same reference data -> identical recipe JSON.
const { recipe: recipeA } = resolveJam(intentDriving, refs);
const { recipe: recipeB } = resolveJam(intentDriving, refs);
check(
  'resolveJam is deterministic (identical JSON across two independent calls)',
  JSON.stringify(recipeA) === JSON.stringify(recipeB)
);

// 2. Resolve -> render determinism: the whole JamIntent -> JamRecipe -> PCM
// chain must be bit-identical, not just the resolve step in isolation.
function hashRender(recipe) {
  const { channels } = renderJam({ recipe, manifest, assetBase: ROOT });
  const h = createHash('sha256');
  for (const ch of channels) h.update(Buffer.from(ch.buffer.slice(0)));
  return h.digest('hex');
}
const pcmA = hashRender(recipeA);
const pcmB = hashRender(resolveJam(intentDriving, refs).recipe);
check('resolve -> render chain is bit-identical PCM across independent resolves', pcmA === pcmB);

// 3. Trait-sensitivity: trio-driving and trio-gritty share the same seed and
// lineup but differ in vibe/intensity. Pan is seed/lineup-derived only, so it
// must stay identical; mix/bars are vibe/intensity-derived, so they must not.
// This is the machine-checkable proof the mapping is real, not coincidental.
const { recipe: driving } = resolveJam(intentDriving, refs);
const { recipe: gritty } = resolveJam(intentGritty, refs);

const panByArtist = (recipe) =>
  Object.fromEntries(recipe.tracks.map((t) => [t.performerArtistId, t.pan]));
const panDriving = panByArtist(driving);
const panGritty = panByArtist(gritty);
const panIdentical = Object.keys(panDriving).every((id) => panDriving[id] === panGritty[id]);
check('pan is identical across vibe/intensity changes (seed/lineup-derived only)', panIdentical);

const mixDiffers =
  driving.mix.reverbSend !== gritty.mix.reverbSend &&
  driving.mix.masterGain !== gritty.mix.masterGain &&
  driving.bars !== gritty.bars;
check('reverbSend/masterGain/bars all differ across vibe/intensity changes', mixDiffers);

console.log(
  `\ndriving: bars=${driving.bars} reverbSend=${driving.mix.reverbSend} masterGain=${driving.mix.masterGain}`
);
console.log(
  `gritty:  bars=${gritty.bars} reverbSend=${gritty.mix.reverbSend} masterGain=${gritty.mix.masterGain}`
);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll resolver checks passed.');
