// Artist DNA traits consumed by the jam resolver. Field list/taxonomy per
// `.agents/spec/data-model.md` ("Identity & DNA" — Sanity/Swagger/Fame +
// Energy/Rhythm/Melody). All 6 traits are numeric 0-100 positions on bipolar,
// non-hierarchical spectrums; the UI renders them as labelled positions, not
// "higher is better" levels.

export interface ArtistTraits {
  /** Core asset id (or placeholder bot id); matches SoundManifestEntry.sourceBot. */
  artistId: string;
  sanity: number;
  swagger: number;
  fame: number;
  energy: number;
  rhythm: number;
  melody: number;
}

export interface ArtistTraitsRegistry {
  drop: string;
  /** Bumped when the registry field shape changes. */
  schemaVersion: string;
  artists: ArtistTraits[];
}
