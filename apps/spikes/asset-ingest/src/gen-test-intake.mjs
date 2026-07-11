// Fabricates two throwaway synthetic recording sessions (violin + mandolin) so
// the ingestion pipeline can be proven end-to-end without waiting on real
// recordings, and so the "second player doesn't clobber the first" upsert
// behavior actually gets exercised. NOT real intake data — regenerated on
// demand; `intake/_test-session-*/` and `out/` are both gitignored. Reuses
// band-jam's placeholder synths purely as a stand-in source of "audio bytes",
// the same way band-jam itself stood in for real instruments.
import { writeFileSync, mkdirSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeWavPCM16, SAMPLE_RATE } from '../../band-jam/src/wav.mjs';
import {
  renderViolinSignature,
  renderMandolinAccent,
  renderBassoonBed,
  normalize
} from '../../band-jam/src/synth.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const BAND_JAM = join(ROOT, '..', 'band-jam');
const OUT = join(ROOT, 'out');

const BARS = 4;

// R = -L (exact phase inversion). A correct (L+R)/2 downmix must then produce
// EXACT digital silence — this makes the stereo-downmix regression test
// machine-checkable rather than "renders without crashing".
function invert(buf) {
  const out = new Float32Array(buf.length);
  for (let i = 0; i < buf.length; i++) out[i] = -buf[i];
  return out;
}

function writeSession(name, { sonicIdentityId, seed, bpm, render, credit, stereo = false }) {
  const dir = join(ROOT, 'intake', name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const writeTake = (fileName, mono) => {
    const channels = stereo ? [mono, invert(mono)] : [mono];
    writeWavPCM16(join(dir, fileName), channels, SAMPLE_RATE);
  };

  const hero = normalize(render(seed, { bpm, bars: BARS }), 0.85);
  writeTake('hero-take.wav', hero);

  const excerptFrames = Math.min(hero.length, Math.round(SAMPLE_RATE * 3));
  writeTake('excerpt.wav', hero.slice(0, excerptFrames));

  const sliceFiles = [];
  for (let i = 0; i < 3; i++) {
    const slice = normalize(render(seed + i + 1, { bpm, bars: 1 }), 0.85);
    const file = `slice-0${i + 1}.wav`;
    writeTake(file, slice);
    sliceFiles.push(file);
  }

  const session = {
    sonicIdentityId,
    sessionId: `${name}-2026-01-01`,
    date: '2026-01-01',
    location: 'TEST FIXTURE — not a real session',
    bpm,
    tempoRange: [bpm - 4, bpm + 4],
    keyCenter: 'Dm',
    meter: '4/4',
    credit,
    rights: 'TEST FIXTURE — placeholder rights string, not a real grant',
    hero: { file: 'hero-take.wav', bars: BARS, tags: ['test'] },
    excerpt: { file: 'excerpt.wav' },
    slices: sliceFiles.map((file) => ({ file, kind: 'phrase', bars: 1, tags: ['test'] }))
  };
  writeFileSync(join(dir, 'session.json'), JSON.stringify(session, null, 2) + '\n');
  console.log(`  wrote test intake session -> ${dir}`);
}

writeSession('_test-session-violin', {
  sonicIdentityId: 'sonic-identity-violin-rose',
  seed: 990099,
  bpm: 100,
  render: renderViolinSignature,
  credit: 'TEST FIXTURE — not a real performer credit'
});

writeSession('_test-session-mandolin', {
  sonicIdentityId: 'sonic-identity-mandolin-scroggins',
  seed: 880088,
  bpm: 100,
  render: renderMandolinAccent,
  credit: 'TEST FIXTURE — not a real performer credit'
});

// Phase-inverted stereo fixture — see src/verify-stereo.mjs, which renders
// this through the real jam.mjs and asserts exact silence.
writeSession('_test-session-stereo', {
  sonicIdentityId: 'sonic-identity-bassoon-chaves',
  seed: 770077,
  bpm: 100,
  render: renderBassoonBed,
  credit: 'TEST FIXTURE — not a real performer credit',
  stereo: true
});

// Fresh scratch copy of the real identities registry to merge test sessions
// into — never the real band-jam/manifests/sonic-identities.json.
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
copyFileSync(
  join(BAND_JAM, 'manifests', 'sonic-identities.json'),
  join(OUT, 'test-sonic-identities.json')
);
rmSync(join(OUT, 'test-sound-manifest.json'), { force: true });
console.log(`  reset ${join(OUT, 'test-sonic-identities.json')} from the real registry`);
console.log(`  cleared ${join(OUT, 'test-sound-manifest.json')}`);
