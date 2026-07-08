// Reproducibility gate: render the demo jam twice in-process and assert the
// PCM is bit-identical. This is the machine-checkable half of plan 04's exit
// criterion #1 ("deterministic from a recorded recipe: same inputs -> same jam").
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderJam } from './jam.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const recipe = JSON.parse(readFileSync(join(ROOT, 'manifests', 'demo-jam.json'), 'utf8'));
const manifest = JSON.parse(
  readFileSync(join(ROOT, 'manifests', 'placeholder-sounds.json'), 'utf8')
);

function hashRender() {
  const { channels } = renderJam({ recipe, manifest, assetBase: ROOT });
  const h = createHash('sha256');
  for (const ch of channels) h.update(Buffer.from(ch.buffer.slice(0)));
  return h.digest('hex');
}

const a = hashRender();
const b = hashRender();
console.log(`render A: ${a}`);
console.log(`render B: ${b}`);
if (a === b) {
  console.log('✅ deterministic: identical PCM across renders');
  process.exit(0);
}
console.error('❌ non-deterministic: renders diverged');
process.exit(1);
