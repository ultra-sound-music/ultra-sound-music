// Sound manifest — canonical shape for one placeholder or real recording.
// Field list is fixed by `.agents/spec/blocker-decisions.md` ("Sound manifest",
// "Signature source bundle", "Sound attachment control") and
// `.agents/spec/data-model.md` ("SonicIdentity / source profile"). A manifest
// entry is what the jam sequencer loads; swapping a real recording in means
// editing `playbackUri`/`sourceHash` here, with no sequencer code change.

/** Launch role. Future sound roles should be added only when the accumulation mechanic hardens. */
export type SoundRole = 'signature';

/**
 * Whether this entry's source material matches its SonicIdentity's performer/
 * instrument/palette by default, or is a deliberate, documented exception.
 * See blocker-decisions.md "Sound attachment control".
 */
export type SourceProfileMatchStatus = 'match' | 'approvedExtension';

export interface ApprovedExtension {
  /** Why this sound is allowed to extend the Artist's source profile despite not matching by default. */
  rationale: string;
  /** Quality owner who approved the exception (D2: the project owner in v1). */
  approvedBy: string;
  date: string;
  rightsUri: string;
  /** The SonicIdentity this entry extends (usually equal to the entry's own sonicIdentityId). */
  extendsSonicIdentityId: string;
}

/** One short slice/phrase/loop inside a signature sound's internal source bundle. */
export interface SourceBundleComponent {
  /** Stable id, unique within the sound's sourceBundle. Referenced by JamTrack.sourceComponentId. */
  componentId: string;
  kind: 'slice' | 'phrase' | 'loop';
  bpm: number;
  tempoRange: [number, number];
  meter: string;
  bars: number;
  keyCenter: string;
  loopPoints: [number, number];
  durationSeconds: number;
  beats: number;
  loudness: number;
  peak: number;
  tags: string[];
  sourceHash: string;
  canonicalUri: string;
  playbackUri: string;
}

/**
 * The internal material backing a user-facing `signature` sound (blocker-decisions
 * "Signature source bundle"). The owner-facing concept stays "one signature sound";
 * this is what gives the jam resolver enough Artist-owned material to generate
 * tempo/key-specific jams without a generic backing track. Optional: placeholders
 * and not-yet-sliced recordings may have only the top-level canonical entry.
 */
export interface SourceBundle {
  /** Short public teaser render, distinct from the full canonicalUri/playbackUri render. */
  auditionExcerpt: {
    durationSeconds: number;
    sourceHash: string;
    canonicalUri: string;
    playbackUri: string;
  };
  components: SourceBundleComponent[];
}

export interface SoundManifestEntry {
  /** Stable id, unique within a drop. Referenced by jam recipes. */
  id: string;
  /** Core asset id (or placeholder bot id) this sound belongs to. */
  sourceBot: string;
  /** References SonicIdentity.sonicIdentityId — couples this sound to its Artist's source profile. */
  sonicIdentityId: string;
  sourceProfileMatchStatus: SourceProfileMatchStatus;
  /** Required when sourceProfileMatchStatus is 'approvedExtension'; absent otherwise. */
  approvedExtension?: ApprovedExtension;
  /** Recording session/take this entry was captured in, when known. */
  sourceSessionRef?: { sessionId: string; takeId?: string };
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
  /** Internal material backing this signature sound; absent for not-yet-sliced recordings. */
  sourceBundle?: SourceBundle;
}

export interface SoundManifest {
  drop: string;
  /** Bumped when the manifest field shape changes. */
  schemaVersion: string;
  sounds: SoundManifestEntry[];
}
