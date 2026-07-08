// Dependency-free WAV I/O for the sound-jam spike.
// Internal audio is Float32 in [-1, 1]; files are 16-bit PCM (masters spec is
// 48k/24-bit, but placeholders only need to be playable — real recordings drop
// in as WAVs and this same reader ingests them).
import { readFileSync, writeFileSync } from 'node:fs';

export const SAMPLE_RATE = 44100;

// channels: Float32Array[] (1 = mono, 2 = stereo). All same length.
export function writeWavPCM16(path, channels, sampleRate = SAMPLE_RATE) {
  const numCh = channels.length;
  const numFrames = channels[0].length;
  const bytesPerSample = 2;
  const blockAlign = numCh * bytesPerSample;
  const dataBytes = numFrames * blockAlign;
  const buf = Buffer.alloc(44 + dataBytes);

  buf.write('RIFF', 0, 'ascii');
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write('WAVE', 8, 'ascii');
  buf.write('fmt ', 12, 'ascii');
  buf.writeUInt32LE(16, 16); // PCM fmt chunk size
  buf.writeUInt16LE(1, 20); // audio format = PCM
  buf.writeUInt16LE(numCh, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * blockAlign, 28);
  buf.writeUInt16LE(blockAlign, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36, 'ascii');
  buf.writeUInt32LE(dataBytes, 40);

  let off = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = channels[c][i];
      if (s > 1) s = 1;
      else if (s < -1) s = -1;
      // Symmetric quantization, round-to-nearest — deterministic across runs.
      const v = Math.round(s * 32767);
      buf.writeInt16LE(v, off);
      off += 2;
    }
  }
  writeFileSync(path, buf);
  return { numCh, numFrames, sampleRate, path };
}

// Minimal PCM WAV reader: handles 16- and 24-bit, mono/stereo, skips unknown
// chunks. Returns { sampleRate, channels: Float32Array[] }.
export function readWav(path) {
  const buf = readFileSync(path);
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error(`${path}: not a RIFF/WAVE file`);
  }
  let fmt = null;
  let dataOffset = -1;
  let dataSize = 0;
  let p = 12;
  while (p + 8 <= buf.length) {
    const id = buf.toString('ascii', p, p + 4);
    const size = buf.readUInt32LE(p + 4);
    const body = p + 8;
    if (id === 'fmt ') {
      fmt = {
        audioFormat: buf.readUInt16LE(body),
        numCh: buf.readUInt16LE(body + 2),
        sampleRate: buf.readUInt32LE(body + 4),
        bitsPerSample: buf.readUInt16LE(body + 14)
      };
    } else if (id === 'data') {
      dataOffset = body;
      dataSize = size;
    }
    p = body + size + (size % 2); // chunks are word-aligned
  }
  if (!fmt || dataOffset < 0) throw new Error(`${path}: missing fmt/data chunk`);
  if (fmt.audioFormat !== 1)
    throw new Error(`${path}: only PCM supported (got ${fmt.audioFormat})`);

  const { numCh, bitsPerSample, sampleRate } = fmt;
  const bytesPerSample = bitsPerSample / 8;
  const frameBytes = numCh * bytesPerSample;
  const numFrames = Math.floor(dataSize / frameBytes);
  const channels = Array.from({ length: numCh }, () => new Float32Array(numFrames));

  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < numCh; c++) {
      const off = dataOffset + i * frameBytes + c * bytesPerSample;
      let s;
      if (bitsPerSample === 16) {
        s = buf.readInt16LE(off) / 32768;
      } else if (bitsPerSample === 24) {
        let v = buf[off] | (buf[off + 1] << 8) | (buf[off + 2] << 16);
        if (v & 0x800000) v |= ~0xffffff; // sign-extend
        s = v / 8388608;
      } else {
        throw new Error(`${path}: unsupported bit depth ${bitsPerSample}`);
      }
      channels[c][i] = s;
    }
  }
  return { sampleRate, channels };
}
