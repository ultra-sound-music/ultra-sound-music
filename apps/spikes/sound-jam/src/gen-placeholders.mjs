// Renders the 3 placeholder instrument loops to WAV and writes a sound manifest
// that conforms to schema/sound-manifest.schema.json. Run once to bootstrap;
// re-running is deterministic (identical bytes). Real recordings later replace
// the assets/*.wav files and the manifest's playbackUri/sourceHash.
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeWavPCM16, SAMPLE_RATE } from './wav.mjs';
import {
  renderBassoonBed,
  renderViolinSignature,
  renderMandolinAccent,
  normalize,
  loopGeometry
} from './synth.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

const BPM = 90;
const BARS = 4;
const SEED = 20260706; // fixed → reproducible placeholders

const geo = loopGeometry({ bpm: BPM, bars: BARS });

const specs = [
  {
    id: 'ph-bassoon-signature',
    bot: 'jambot-placeholder-bassoon',
    role: 'signature',
    file: 'bassoon-signature.wav',
    credit: 'Placeholder synth (stands in for Sebastian Chaves — bassoon)',
    tags: ['bassoon', 'drone', 'low', 'sustained', 'placeholder'],
    render: () => normalize(renderBassoonBed(SEED, { bpm: BPM, bars: BARS }), 0.85)
  },
  {
    id: 'ph-violin-signature',
    bot: 'jambot-placeholder-violin',
    role: 'signature',
    file: 'violin-signature.wav',
    credit: 'Placeholder synth (stands in for Alisa Rose — violin)',
    tags: ['violin', 'melody', 'lead', 'vibrato', 'placeholder'],
    render: () => normalize(renderViolinSignature(SEED, { bpm: BPM, bars: BARS }), 0.85)
  },
  {
    id: 'ph-mandolin-signature',
    bot: 'jambot-placeholder-mandolin',
    role: 'signature',
    file: 'mandolin-signature.wav',
    credit: 'Placeholder synth (stands in for Tristan Scroggins — mandolin)',
    tags: ['mandolin', 'pluck', 'tremolo', 'arpeggio', 'placeholder'],
    render: () => normalize(renderMandolinAccent(SEED, { bpm: BPM, bars: BARS }), 0.8)
  }
];

function stats(buf) {
  let peak = 0;
  let sumSq = 0;
  for (let i = 0; i < buf.length; i++) {
    const a = Math.abs(buf[i]);
    if (a > peak) peak = a;
    sumSq += buf[i] * buf[i];
  }
  const rms = Math.sqrt(sumSq / buf.length);
  const loudness = rms > 0 ? 20 * Math.log10(rms) : -120;
  return { peak: +peak.toFixed(4), loudness: +loudness.toFixed(1) };
}

const sounds = [];
for (const s of specs) {
  const mono = s.render();
  const outPath = join(ROOT, 'assets', s.file);
  writeWavPCM16(outPath, [mono], SAMPLE_RATE);
  const { peak, loudness } = stats(mono);
  const bytes = new Uint8Array(mono.buffer.slice(0));
  const sourceHash =
    'sha256:' + createHash('sha256').update(Buffer.from(bytes)).digest('hex').slice(0, 16);
  sounds.push({
    id: s.id,
    sourceBot: s.bot,
    role: s.role,
    bpm: BPM,
    tempoRange: [BPM - 6, BPM + 6],
    meter: '4/4',
    bars: BARS,
    keyCenter: 'Dm',
    loopPoints: [0, geo.total],
    durationSeconds: +(geo.total / SAMPLE_RATE).toFixed(3),
    beats: BARS * 4,
    loudness,
    peak,
    tags: s.tags,
    credit: s.credit,
    rights: 'Placeholder — CC0 synth output. Real recordings carry their own rights.',
    sourceHash,
    canonicalUri: `arweave://placeholder/${s.id}`,
    playbackUri: `./assets/${s.file}`
  });
  console.log(`  rendered ${s.file}  peak=${peak}  loudness=${loudness}dB  hash=${sourceHash}`);
}

const manifest = { drop: 'jam-bots-genesis-placeholders', schemaVersion: '1.0.0', sounds };
writeFileSync(
  join(ROOT, 'manifests', 'placeholder-sounds.json'),
  JSON.stringify(manifest, null, 2)
);
console.log(`  wrote manifests/placeholder-sounds.json (${sounds.length} sounds)`);
