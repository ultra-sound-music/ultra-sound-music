// Jam recipe — the deterministic spec that renders one jam, and the future
// Music NFT provenance spine. Field list is fixed by
// `.agents/spec/blocker-decisions.md` ("Jam recipe fields"). Same recipe +
// same referenced sounds + same engineVersion → bit-identical render.

export type JamTrackRole = 'signature';

export interface JamTrack {
  /** Artist performing this track. V1 requires the sound to belong to this Artist. */
  performerArtistId: string;
  /** References a SoundManifestEntry.id. */
  soundId: string;
  /**
   * References the same SoundManifestEntry.sonicIdentityId. Redundant with the
   * sound's own field by construction, but present here so the recipe alone
   * proves the "coupled via artistId + sonicIdentityId + source hash" contract
   * (data-model.md "Band jam mechanism contract") without a manifest lookup.
   */
  sonicIdentityId: string;
  /**
   * Optional: references a SourceBundleComponent.componentId within the sound's
   * sourceBundle, when the resolver picks a specific slice/phrase/loop instead of
   * the sound's canonical preview render. Not yet consumed by the render engine
   * (component-level selection is future band-jam engine work).
   */
  sourceComponentId?: string;
  /** Role the sound plays in this jam. V1 uses only signature sounds. */
  role: JamTrackRole;
  /** Named pattern this track follows (engine-defined). */
  patternId: string;
  gain: number;
  /** Stereo pan in [-1,1]; -1 left, +1 right. */
  pan: number;
}

export interface JamRecipe {
  /** App-layer band id (launch bands are app-layer per blocker-decisions). */
  bandId: string;
  /** Artist member ids composing the band. */
  memberIds: string[];
  /** Master seed controlling all deterministic choices. */
  seed: number;
  tempo: number;
  keyCenter: string;
  bars: number;
  tracks: JamTrack[];
  /** Global mix/effect params (reverb send, master gain, etc.). */
  mix: {
    masterGain: number;
    reverbSend: number;
  };
  /** Engine version — pinned so a render is reproducible against it. */
  engineVersion: string;
  /** sourceHash of each referenced sound at render time (provenance). */
  sourceHashes: Record<string, string>;
}
