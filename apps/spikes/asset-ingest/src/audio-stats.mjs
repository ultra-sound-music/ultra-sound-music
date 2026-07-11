// Hash + basic audio stats for one intake WAV file, feeding SoundManifestEntry /
// SourceBundleComponent fields. Reuses band-jam's dependency-free WAV reader —
// asset-ingest is deliberately downstream of band-jam (see README "Cross-spike
// dependency"), not a copy of it.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { readWav } from '../../band-jam/src/wav.mjs';

// Full sha256 hex digest. Unlike band-jam's placeholder generator (which
// truncates to 16 hex chars for throwaway synths), real recordings are
// one-of-a-kind masters, so the full digest is used deliberately here.
export function hashFile(path) {
  const bytes = readFileSync(path);
  return 'sha256:' + createHash('sha256').update(bytes).digest('hex');
}

export function audioStats(path) {
  const { sampleRate, channels } = readWav(path);
  const numFrames = channels[0].length; // frame count is channel-count-independent
  // peak/loudness consider every channel — real recordings may be stereo (the
  // recording brief doesn't require mono); the render engine downmixes to
  // mono at render time (see band-jam/src/jam.mjs), but stats here should
  // reflect the actual recorded signal, not just the left channel.
  let peak = 0;
  let sumSq = 0;
  let totalSamples = 0;
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      const a = Math.abs(ch[i]);
      if (a > peak) peak = a;
      sumSq += ch[i] * ch[i];
      totalSamples++;
    }
  }
  const rms = Math.sqrt(sumSq / totalSamples);
  const loudness = rms > 0 ? 20 * Math.log10(rms) : -120;
  return {
    sampleRate,
    numChannels: channels.length,
    numFrames,
    durationSeconds: +(numFrames / sampleRate).toFixed(3),
    peak: +Math.min(peak, 1).toFixed(4),
    loudness: +loudness.toFixed(1)
  };
}

export function hashAndStat(path) {
  return { sourceHash: hashFile(path), ...audioStats(path) };
}
