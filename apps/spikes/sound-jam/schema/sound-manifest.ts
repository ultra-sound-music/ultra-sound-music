// Sound manifest — canonical shape for one placeholder or real recording.
// Field list is fixed by `.agents/spec/blocker-decisions.md` ("Sound manifest").
// A manifest entry is what the jam sequencer loads; swapping a real recording in
// means editing `playbackUri`/`sourceHash` here, with no sequencer code change.

/** Launch role. Future sound roles should be added only when the accumulation mechanic hardens. */
export type SoundRole = 'signature';

export interface SoundManifestEntry {
  /** Stable id, unique within a drop. Referenced by jam recipes. */
  id: string;
  /** Core asset id (or placeholder bot id) this sound belongs to. */
  sourceBot: string;
  role: SoundRole;
  /** Nominal tempo the loop was recorded/rendered at. */
  bpm: number;
  /** Acceptable playback tempo range [min, max] for time-stretch tolerance. */
  tempoRange: [number, number];
  /** e.g. "4/4". */
  meter: string;
  /** Length of the loop in bars. */
  bars: number;
  /** Musical key / pitch center, e.g. "Dm" or "D4". */
  keyCenter: string;
  /** Seamless loop points in samples [start, end]; end is exclusive. */
  loopPoints: [number, number];
  durationSeconds: number;
  beats: number;
  /** Integrated loudness estimate (dBFS-ish); informational for mixing. */
  loudness: number;
  /** Peak sample magnitude in [0,1]. */
  peak: number;
  tags: string[];
  /** Performer + instrument credit. */
  credit: string;
  /** Rights string or URI (blocker-decisions "Audio derivative rights"). */
  rights: string;
  /** Content hash of the source master (integrity + provenance spine). */
  sourceHash: string;
  /** Permanent canonical storage (Arweave/Irys); source of truth. */
  canonicalUri: string;
  /** Fast web-playback derivative; may be a CDN/cache URL or local path. */
  playbackUri: string;
}

export interface SoundManifest {
  drop: string;
  /** Bumped when the manifest field shape changes. */
  schemaVersion: string;
  sounds: SoundManifestEntry[];
}
