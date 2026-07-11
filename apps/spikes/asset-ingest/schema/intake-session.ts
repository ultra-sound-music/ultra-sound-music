// Intake session — the one hand-written file per recording session, matching
// `.agents/spec/vijay-recording-brief.md`'s "three pieces per player" format
// (hero take / short excerpt / extra slices). This is asset-ingest's only
// hand-authored input; `src/ingest.mjs` derives everything else (hashes,
// stub-uploads, SoundManifestEntry/SonicIdentity records) from it.

export type SliceKind = 'slice' | 'phrase' | 'loop';

export interface IntakeFileRef {
  /** Path to the WAV, relative to this session.json file's own directory. */
  file: string;
}

export interface IntakeHero extends IntakeFileRef {
  /** Length of the loop in bars, at the session's shared bpm/meter. */
  bars: number;
  /** Seamless loop points in samples [start, end]; omitted/null end = full-file length. */
  loopPoints?: [number, number | null];
  tags: string[];
}

export interface IntakeSlice extends IntakeFileRef {
  kind: SliceKind;
  /** Real slices aren't guaranteed bar-aligned; entered by a human, not computed from duration. */
  bars: number;
  tags: string[];
  /** Stable id within this sound's sourceBundle; default `${sessionId}-slice-<n>` by file order. */
  componentId?: string;
  /** Slices may depart more freely from the session-level shared tempo/key than the hero take. */
  bpm?: number;
  tempoRange?: [number, number];
  keyCenter?: string;
  meter?: string;
}

export interface IntakeSession {
  /** Must already exist in sonic-identities.json — this tool ingests for known Artists only. */
  sonicIdentityId: string;
  sessionId: string;
  date: string;
  location?: string;
  notes?: string;
  /** Shared tempo/key the hero take is locked to (recording-brief constraint). */
  bpm: number;
  tempoRange: [number, number];
  keyCenter: string;
  meter: string;
  credit: string;
  rights: string;
  /** SoundManifestEntry.id; default derived from sonicIdentityId — see ingest.mjs. */
  id?: string;
  hero: IntakeHero;
  excerpt: IntakeFileRef;
  slices: IntakeSlice[];
}
