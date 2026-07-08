// SonicIdentity / source profile — the coupling layer between a USM Artist, a
// real performance source, and a recognizable sound quality. Field list is fixed
// by `.agents/spec/data-model.md` ("SonicIdentity / source profile") and
// `.agents/spec/blocker-decisions.md` ("Artist source profile", "Artist sonic
// identity"). Every SoundManifestEntry references one via `sonicIdentityId`; this
// is what stops an Artist from being a random NFT plus a random WAV.

export interface SourcePerformerCredit {
  /** Real name or handle, e.g. "Alisa Rose". */
  name: string;
  /** e.g. "performer", "engineer", "producer". */
  role: string;
  instrument: string;
}

export interface SourceSession {
  sessionId: string;
  /** Specific take within the session, when takes are tracked individually. */
  takeId?: string;
  date?: string;
  location?: string;
  notes?: string;
  /** Content hashes of the raw session/take files retained for this session. */
  sourceFileHashes: string[];
}

export interface SonicIdentity {
  /** Core asset id (or placeholder bot id) this profile belongs to. */
  artistId: string;
  /** Stable id, unique within a drop. Referenced by SoundManifestEntry.sonicIdentityId. */
  sonicIdentityId: string;
  sourcePerformerCredits: SourcePerformerCredit[];
  /** Empty until real recordings exist; placeholders reference no session. */
  sourceSessions: SourceSession[];
  /** The Artist's core voice, even if future sounds vary in role or texture. */
  primaryInstrument: string;
  instrumentFamily: string;
  /** Plain-language target: tone, room, attack, texture, processing, mood. */
  qualityBrief: string;
  /** Concise searchable tags for timbre, articulation, processing, source character. */
  paletteTags: string[];
  /** Durable public pointer to the rights/provenance statement. */
  rightsUri: string;
  /** Internal cleared-rights record; may equal rightsUri pre-launch. */
  provenanceUri: string;
}

export interface SonicIdentityRegistry {
  drop: string;
  /** Bumped when the registry field shape changes. */
  schemaVersion: string;
  identities: SonicIdentity[];
}
