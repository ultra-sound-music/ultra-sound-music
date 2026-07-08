// Jam intent — the input to the artist-aware resolver (data-model.md "Band jam
// mechanism contract"). A JamIntent references a Band lineup + a seed + Band
// vibe/intensity levers + engine version; resolveJam() turns this into a
// JamRecipe. `vibe`'s vocabulary reuses the D3 sonic north-star mood words
// verbatim (plan 04, D3) rather than inventing new ones. `vibe`/`intensity`'s
// concrete shape is spike-local — the spec only says these are Band-level
// cosmetic levers the proposer can edit, not a locked data shape.

export type JamVibe = 'driving' | 'neon' | 'gritty';

export interface JamIntent {
  /** App-layer Band id (launch bands are app-layer per blocker-decisions). */
  bandId: string;
  /** Artist member ids in the lineup; 2-6 per the Band size rule. */
  memberIds: string[];
  /** Master seed controlling all deterministic resolver choices. */
  seed: number;
  vibe: JamVibe;
  /** Band intensity dial, 0-100. */
  intensity: number;
  /** Engine version this intent expects to resolve/render against. */
  engineVersion: string;
}
