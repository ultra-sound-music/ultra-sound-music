// Artist DNA traits consumed by the jam resolver. Field list/taxonomy per
// `.agents/spec/data-model.md` ("Identity & DNA" — Character Traits Spark/
// Swagger/Fame, Musical Traits Melodic Style/Rhythmic Style/Energy). Spark/
// Swagger/Fame/Energy are numeric 0-100 spectrum positions, not "higher is
// better" levels; Melodic Style/Rhythmic Style are categorical labels.
//
// The concrete category vocabulary below (MelodicStyle/RhythmicStyle) is
// spike-local, invented for the band-jam resolver — data-model.md documents
// the taxonomy's existence but does not lock a value list anywhere.

export type MelodicStyle = 'droning' | 'lyrical' | 'arpeggiated';
export type RhythmicStyle = 'sustained' | 'flowing' | 'syncopated';

export interface ArtistTraits {
  /** Core asset id (or placeholder bot id); matches SoundManifestEntry.sourceBot. */
  artistId: string;
  spark: number;
  swagger: number;
  fame: number;
  melodicStyle: MelodicStyle;
  rhythmicStyle: RhythmicStyle;
  energy: number;
}

export interface ArtistTraitsRegistry {
  drop: string;
  /** Bumped when the registry field shape changes. */
  schemaVersion: string;
  artists: ArtistTraits[];
}
