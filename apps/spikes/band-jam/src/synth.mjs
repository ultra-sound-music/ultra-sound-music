// Deterministic placeholder-instrument synthesis for the band-jam spike.
// These stand in for real recordings (violin/mandolin/bassoon — the fixed Jam
// Bots provenance palette). Everything is a pure function of (seed, params), so
// renders are bit-identical run to run. Real WAVs replace these by swapping the
// manifest `playbackUri`; nothing here is on the app's critical path.

export const SR = 44100;

// --- seeded PRNG (mulberry32) — never Math.random, so output is reproducible ---
export function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

// D natural minor, the shared key center for the whole placeholder drop.
export const SCALE_DMINOR = [62, 64, 65, 67, 69, 70, 72]; // D E F G A Bb C
// One chord per bar over a 4-bar loop: Dm – Bb – F – C.
export const PROGRESSION = [
  { name: 'Dm', root: 38, tones: [62, 65, 69] },
  { name: 'Bb', root: 34, tones: [65, 70, 74] },
  { name: 'F', root: 41, tones: [65, 69, 72] },
  { name: 'C', root: 36, tones: [60, 64, 67] }
];

function adsr(i, n, sr, { a, d, s, r }) {
  const aN = a * sr,
    dN = d * sr,
    rN = r * sr;
  const relStart = n - rN;
  if (i < aN) return i / aN;
  if (i < aN + dN) return 1 - (1 - s) * ((i - aN) / dN);
  if (i < relStart) return s;
  return s * Math.max(0, 1 - (i - relStart) / rN);
}

// Additive tone with explicit partial weights (band-limited: no partial above
// Nyquist, so no aliasing). vibrato in Hz/depth-cents.
function renderTone(buf, startSample, freq, durSamples, sr, weights, env, gain, rng, vib) {
  const nyq = sr / 2;
  const vibHz = vib ? vib.hz : 0;
  const vibDepth = vib ? vib.cents / 1200 : 0; // fractional semitone-ish
  const phase0 = rng() * Math.PI * 2; // per-note phase, deterministic
  for (let i = 0; i < durSamples; i++) {
    const t = i / sr;
    const vibrato = vibHz ? 1 + vibDepth * Math.sin(2 * Math.PI * vibHz * t) : 1;
    const f = freq * vibrato;
    let sample = 0;
    for (let k = 1; k <= weights.length; k++) {
      const w = weights[k - 1];
      if (!w) continue;
      if (f * k >= nyq) break;
      sample += w * Math.sin(2 * Math.PI * f * k * t + phase0 * k);
    }
    sample *= adsr(i, durSamples, sr, env) * gain;
    const idx = startSample + i;
    if (idx < buf.length) buf[idx] += sample;
  }
}

// Karplus–Strong pluck for the mandolin. Seeded noise burst → decaying string.
function renderPluck(buf, startSample, freq, durSamples, sr, gain, rng) {
  const N = Math.max(2, Math.round(sr / freq));
  const delay = new Float32Array(N);
  for (let i = 0; i < N; i++) delay[i] = rng() * 2 - 1;
  const decay = 0.996;
  let di = 0;
  for (let i = 0; i < durSamples; i++) {
    const cur = delay[di];
    const nxt = delay[(di + 1) % N];
    const avg = decay * 0.5 * (cur + nxt);
    delay[di] = avg;
    di = (di + 1) % N;
    // Soft pick attack shaping + gentle overall fade so re-plucks don't click.
    const body = i < 40 ? i / 40 : 1;
    const idx = startSample + i;
    if (idx < buf.length) buf[idx] += cur * gain * body;
  }
}

// Loop geometry shared by every instrument so tiles line up sample-exactly.
export function loopGeometry({ bpm, bars, beatsPerBar = 4, sr = SR }) {
  const samplesPerBeat = Math.round((sr * 60) / bpm); // integer at bpm=90
  const samplesPerBar = samplesPerBeat * beatsPerBar;
  return { samplesPerBeat, samplesPerBar, total: samplesPerBar * bars };
}

// --- instrument loop renderers: each returns one seamless mono loop ---

export function renderBassoonBed(seed, { bpm, bars, sr = SR }) {
  const rng = makeRng(seed ^ 0x0b0550);
  const g = loopGeometry({ bpm, bars, sr });
  const out = new Float32Array(g.total);
  // Double-reed-ish partials: strong low harmonics, hollow upper.
  const weights = [1, 0.65, 0.9, 0.35, 0.5, 0.2, 0.28, 0.12, 0.15];
  const env = { a: 0.09, d: 0.2, s: 0.85, r: 0.35 };
  for (let bar = 0; bar < bars; bar++) {
    const chord = PROGRESSION[bar % PROGRESSION.length];
    const start = bar * g.samplesPerBar;
    const dur = g.samplesPerBar - Math.round(0.02 * sr); // small gap = clean loop
    renderTone(out, start, midiToHz(chord.root), dur, sr, weights, env, 0.5, rng, {
      hz: 4.2,
      cents: 6
    });
    // add the fifth softly for body
    renderTone(out, start, midiToHz(chord.root + 7), dur, sr, weights, env, 0.22, rng, {
      hz: 4.2,
      cents: 6
    });
  }
  return out;
}

export function renderViolinSignature(seed, { bpm, bars, sr = SR }) {
  const rng = makeRng(seed ^ 0x7104ee);
  const g = loopGeometry({ bpm, bars, sr });
  const out = new Float32Array(g.total);
  // Bowed-string-ish: sawtooth rolled off (approx a gentle lowpass), vibrato.
  const weights = Array.from({ length: 14 }, (_, k) => Math.exp(-k / 6) / (k + 1));
  const env = { a: 0.06, d: 0.1, s: 0.8, r: 0.18 };
  // A singable phrase: chord tone on the downbeat, stepwise motion after.
  for (let bar = 0; bar < bars; bar++) {
    const chord = PROGRESSION[bar % PROGRESSION.length];
    const beats = [0, 1, 2, 3];
    let prev = chord.tones[1] + 12; // start around the chord third, up an octave
    for (const b of beats) {
      // rest ~1 beat in 4, deterministically
      if (rng() < 0.22) continue;
      let note;
      if (b === 0) {
        note = chord.tones[Math.floor(rng() * chord.tones.length)] + 12;
      } else {
        // step to a nearby scale tone for melodic contour
        const nearest = SCALE_DMINOR.map((m) => m + 12)
          .concat(SCALE_DMINOR.map((m) => m + 24))
          .sort((x, y) => Math.abs(x - prev) - Math.abs(y - prev));
        const pick = nearest[Math.floor(rng() * 3)] ?? prev;
        note = pick;
      }
      prev = note;
      const long = rng() < 0.3;
      const durBeats = long ? 1.5 : 0.9;
      const start = bar * g.samplesPerBar + b * g.samplesPerBeat;
      const dur = Math.round(durBeats * g.samplesPerBeat);
      renderTone(out, start, midiToHz(note), dur, sr, weights, env, 0.32, rng, {
        hz: 5.4,
        cents: 9
      });
    }
  }
  return out;
}

export function renderMandolinAccent(seed, { bpm, bars, sr = SR }) {
  const rng = makeRng(seed ^ 0x3a9d01);
  const g = loopGeometry({ bpm, bars, sr });
  const out = new Float32Array(g.total);
  const sixteenth = Math.round(g.samplesPerBeat / 4);
  for (let bar = 0; bar < bars; bar++) {
    const chord = PROGRESSION[bar % PROGRESSION.length];
    const voices = chord.tones.map((m) => m + 12); // up an octave, bright
    // Tremolo sixteenths arpeggiating the chord — the mandolin signature.
    for (let s = 0; s < 16; s++) {
      if (rng() < 0.15) continue; // occasional gap for groove
      const note = voices[s % voices.length];
      const start = bar * g.samplesPerBar + s * sixteenth;
      const dur = Math.round(sixteenth * 2.2);
      renderPluck(out, start, midiToHz(note), dur, sr, 0.5, rng);
    }
  }
  return out;
}

// Peak-normalize a mono loop to a target so placeholder levels are sane.
export function normalize(buf, target = 0.9) {
  let peak = 0;
  for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i]));
  if (peak === 0) return buf;
  const g = target / peak;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
  return buf;
}
