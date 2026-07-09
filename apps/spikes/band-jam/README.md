# Band-Jam Spike

The **forward-going, artist-aware** jam spike (its frozen predecessor is `../sound-jam/`, the pure
mechanical transport proof). Here **Artists jam, not loose sound files**: each Artist owns a
`signature` sound in a manifest inventory, each sound is coupled to a `sonicIdentity` source
profile, and a trait-driven **resolver** (`src/resolver.mjs`) turns a Band `JamIntent` into a
`JamRecipe` — see "Artist-aware resolver" below. This directory began as a copy of `sound-jam` but
its domain model has since diverged; treat the resolver + schemas here as the current model, per
`.agents/spec/data-model.md` ("Band jam mechanism contract").

Plan 04, workstream A (`.agents/plans/04-product-validation.md`). Proves the **mechanical**
product risk: can signature-sound instrument loops play in sync on a shared clock and render a
deterministic, shareable jam artifact — driven entirely by manifests, so real recordings replace
the placeholders with **zero code change**.

Dependency-free: pure Node (no Tone.js, no Web Audio, no browser). Audio is synthesized and mixed by
writing PCM directly, then encoded to MP3 with the system `ffmpeg`. A sample-indexed clock makes the
render **bit-identical run to run**.

## Run it

```
cd apps/spikes/band-jam
npm run all          # gen placeholders -> render jam -> encode mp3 -> verify determinism -> verify resolver
```

Individual steps:

| Script                                                              | Does                                                                                                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run gen`                                                       | Render the 3 placeholder instrument loops + write the sound manifest                                                                                   |
| `npm run render`                                                    | Sequence + mix the demo jam (hand-authored recipe) → `out/jam.wav`                                                                                     |
| `npm run render:ambient`                                            | A second hand-authored recipe (duo, more reverb) → `out/jam-ambient.wav`                                                                               |
| `npm run resolve:trio-driving`                                      | Resolve + render a `JamIntent` through the trait-aware resolver → `out/jam-trio-driving.wav`                                                           |
| `npm run resolve:duo-neon`                                          | Same, different lineup/seed/vibe/intensity → `out/jam-duo-neon.wav`                                                                                    |
| `npm run resolve:trio-gritty`                                       | Same seed/lineup as trio-driving, different vibe/intensity (isolates the effect) → `out/jam-trio-gritty.wav`                                           |
| `npm run share`                                                     | Encode `out/jam.wav` → `out/jam.mp3` (the shareable artifact)                                                                                          |
| `npm run share:trio-driving`, `share:duo-neon`, `share:trio-gritty` | Encode the 3 resolver outputs to MP3 — **not run by `npm run all`**, so run these by hand if you want to actually listen to what the resolver produced |
| `npm run verify`                                                    | Render twice, assert identical PCM (reproducibility gate)                                                                                              |
| `npm run verify:resolve`                                            | Resolver determinism + trait-sensitivity gate (see below)                                                                                              |

**The shareable artifact is `out/jam.mp3`** (~43s). `out/jam-spectrogram.png` shows the structure.

## How it fits together (the seam)

```
schema/sound-manifest.{ts,schema.json}   <- canonical shape (blocker-decisions "Sound manifest",
                                            "Signature source bundle", "Sound attachment control")
schema/jam-recipe.{ts,schema.json}       <- canonical shape (blocker-decisions "Jam recipe fields")
schema/sonic-identity.{ts,schema.json}   <- canonical shape (data-model.md "SonicIdentity / source
                                            profile") — couples an Artist to real performer credits,
                                            session(s), and a quality brief

manifests/placeholder-sounds.json        <- sound manifest: id, signature role, bpm, key, loop points,
                                            credit, rights, hash, canonicalUri, playbackUri,
                                            sonicIdentityId, sourceProfileMatchStatus ...
manifests/sonic-identities.json          <- SonicIdentity registry: 3 records (Chaves/bassoon,
                                            Rose/violin, Scroggins/mandolin), sourceSessions empty
                                            until real recordings exist
manifests/demo-jam.json                  <- jam recipe: band/members, seed, tempo, key, tracks
                                            (performerArtistId + soundId + sonicIdentityId + role +
                                            pattern + gain + pan), mix, engineVersion

schema/jam-intent.{ts,schema.json}        <- canonical shape (data-model.md "Band jam mechanism
                                            contract") — the resolver's input: Band lineup, seed,
                                            vibe/intensity, engine version
schema/artist-traits.{ts,schema.json}     <- canonical shape (data-model.md "Identity & DNA") —
                                            Sanity/Swagger/Fame/Energy/Rhythm/Melody

manifests/artist-traits.json              <- concrete trait values for the 3 placeholder bots
manifests/demo-intent-*.json              <- 3 demo JamIntents proving the mapping is trait-driven

src/resolver.mjs                          <- resolveJam(intent, refs) -> {recipe, log}: the
                                            trait-to-arrangement mapping (see below)
src/verify-resolve.mjs                    <- resolver determinism + trait-sensitivity gate

src/synth.mjs        -> placeholder instruments (violin/mandolin/bassoon-flavored, seeded)
src/gen-placeholders -> renders synth loops to assets/*.wav + emits the sound manifest
src/jam.mjs          -> THE TRANSPORT: loads manifest WAVs, tiles them on one sample-exact grid,
                        pans/mixes, adds reverb, writes the stereo master. Validates both files
                        against the JSON schemas first.
src/verify.mjs       -> determinism gate
```

`jam.mjs` only ever reads audio via a manifest entry's `playbackUri`. It does not know or care
whether the bytes came from the placeholder synth or a studio.

## Swapping in real recordings (the point of the spike)

When Vijay's real loops exist, **no code changes**:

1. Drop the WAVs into `assets/` (or point at Arweave/CDN URLs).
2. Edit `manifests/placeholder-sounds.json`: set each sound's `playbackUri`, `canonicalUri`,
   `sourceHash`, `credit`, `rights`, and real `bpm`/`keyCenter`/`loopPoints`.
3. `npm run render`.

Same for musical variation: edit `manifests/demo-jam.json` (swap sounds, change gains/pans/reverb,
add/remove tracks) — `demo-jam-ambient.json` is a live example that renders a different jam from the
same code and same sounds.

## Determinism

Same recipe + same referenced sounds + same `engineVersion` → bit-identical PCM. There is no
wall-clock and no unseeded randomness anywhere in the render path; all synthesis uses a seeded
`mulberry32` PRNG. `npm run verify` asserts this. This is the property a future Music NFT render
needs (blocker-decisions "Music NFT render path": reproducible from pinned assets + engine version).

## Status against plan 04 exit criteria

- [x] **(1)** A 30–60s jam exists as a shareable artifact, deterministic from a recorded recipe — `out/jam.mp3`, ~43s, `npm run verify` green.
- [x] **(4)** Tooling is manifest-driven; real recordings replace placeholders with no code change.
- [x] **(2)** An outside-the-project person heard it and reacted (2026-07-08, confirmed by owner).
- [x] **(3)** Owner's baseline verdict: "sounded good as a baseline and worth building on top of for
      band-jam." This predates the D3 north star, so it is **not** a D3-gated pass — that gate now
      belongs to this (band-jam) iteration once it's built toward the D3 direction. See
      `.agents/plans/04-product-validation.md` (Progress + Exit criteria).

## Schema pass (2026-07-08)

The manifest/recipe schemas now carry the `sonicIdentity`/source-profile coupling and signature
source-bundle shape decided in `.agents/spec/data-model.md` and `.agents/spec/blocker-decisions.md`:

- `SoundManifestEntry` gained `sonicIdentityId`, `sourceProfileMatchStatus` (`match` /
  `approvedExtension`), optional `approvedExtension`/`sourceSessionRef`, and an optional
  `sourceBundle` (`auditionExcerpt` + `components[]` of `slice`/`phrase`/`loop`). Placeholders omit
  `sourceBundle` — there's no audition excerpt or sliced material until real recordings exist.
- New `SonicIdentity` type + `manifests/sonic-identities.json` registry couple each Artist to
  performer credits, sessions (empty pre-recording), primary instrument, and a quality brief.
- `JamTrack` gained a required `sonicIdentityId` (redundant with the sound's own field by
  construction, but makes the coupling checkable from the recipe alone) and an optional, not-yet-
  consumed `sourceComponentId` for future component-level selection.
- `jam.mjs` now asserts `sound.sonicIdentityId === track.sonicIdentityId` at render time, and the
  `sound-manifest.schema.json` entry definition was inlined (dropping a dead `$ref` the hand-rolled
  validator never dereferenced) so the new required fields are actually enforced, not just declared.
- Out of scope for this pass: the trait-to-arrangement mapping algorithm (now designed and built —
  see "Artist-aware resolver" below) and any engine support for picking a specific `sourceBundle`
  component at render time (still open).

## Artist-aware resolver (2026-07-08)

`data-model.md`'s "Band jam mechanism contract" calls for a `JamIntent` (Band lineup + seed +
vibe/intensity + engine version) to run through a resolver that uses each performing Artist's traits
to deterministically produce a `JamRecipe` — not a hand-typed one. `blocker-decisions.md` flagged
"the exact trait-to-arrangement mapping" as undecided; this is the first concrete implementation.

**New:** `schema/jam-intent.{ts,schema.json}`, `schema/artist-traits.{ts,schema.json}`,
`manifests/artist-traits.json` (concrete Sanity/Swagger/Fame/Energy/Rhythm/Melody values for the 3
placeholder bots, grounded in each bot's `sonic-identities.json` quality brief, with no ties on the
traits currently consumed by resolver rules so every rule's ordering is unambiguous), `src/resolver.mjs`
(`resolveJam(intent, refs) -> {recipe, log}`), `manifests/demo-intent-*.json` (3 demo intents), and
`src/verify-resolve.mjs`. `jam.mjs`'s `renderJam` is unchanged; the CLI only gained an additive
`--intent <path>` flag whose resolved recipe passes through the exact same `jam-recipe.schema.json`
gate a hand-authored recipe does.

**The mapping** (every constant here is a spike-local default, not a locked product decision —
sanity-check by ear before treating any of it as final):

| Trait/lever                                | Drives                                            | Audible today?                                                    |
| ------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------- |
| Swagger (dominant) + Fame + Band Intensity | per-track gain ("mix prominence")                 | **Yes**                                                           |
| Seed (+ lineup order)                      | per-track pan (even spread + small seeded jitter) | **Yes**                                                           |
| Band vibe + Intensity                      | `reverbSend` / `masterGain`                       | **Yes**                                                           |
| Band Intensity                             | `bars` (8/12/16, buckets)                         | **Yes**                                                           |
| Energy (max across lineup)                 | tempo bucket                                      | Computed + logged only — **clamped to native bpm** (see below)    |
| Rhythm                                     | `patternId` label                                 | No — cosmetic/provenance only, confirmed `jam.mjs` never reads it |
| Melody                                     | not consumed yet                                  | No — reserved for future phrase/source-component selection        |
| (uniform across lineup)                    | `keyCenter`                                       | No — confirmed `renderJam` never reads this field either          |

**Every lineup member is always audible** — deliberately, not by default. An earlier design had a
hard inclusion/exclusion rule (low-prominence members silently dropped from the mix). Cutting a
friend's Artist out of the very first jam their Band produces, with no visible reason, is exactly the
kind of undocumented surprise this launch can't afford — so prominence only ever scales gain (floor
0.5), never to silence.

**Tempo is computed but not applied**, on purpose: all 3 placeholder sounds share one bpm, and
forcing a different one would hit the renderer's existing "tile at native length" mismatch path —
still deterministic, but it would drift the loop's baked-in 4-bar chord progression off the bar grid,
which is exactly the "generic loop pack" feel the D3 north star warns against. `energyMax`/`bucket`/
`desiredTempo` are logged for traceability so this is a visible, documented tradeoff, not a silent gap.

Verified: `npm run verify:resolve` (wired into `npm run all`) asserts resolve-determinism,
resolve→render-determinism, and — the key proof — that `trio-driving`/`trio-gritty` (same seed and
lineup, different vibe/intensity) produce **identical pan** but **different** `reverbSend`/
`masterGain`/`bars`, isolating the seed-driven fields from the vibe/intensity-driven ones.

**To actually listen to this:** `out/jam-ambient.mp3` and `out/jam.mp3` are the pre-existing
hand-authored recipes carried over unchanged from `sound-jam` — they will sound identical to that
spike's outputs, correctly. The resolver's actual output is `out/jam-trio-driving.mp3`,
`out/jam-duo-neon.mp3`, `out/jam-trio-gritty.mp3` — run `npm run share:trio-driving` (etc.) to
generate them (not part of `npm run all`, so they don't exist until you ask for them).

**Not in scope here:** `sourceComponentId` selection (no `sourceBundle` components exist on any
placeholder yet) and audible pattern-family/tempo/key variation (needs real multi-take source material
or stretch/shift tooling, neither of which exists). The D3-gated listening pass still waits on real
recordings and a fuller pattern-selection mechanism — this resolver makes the mechanism real and
provably trait-driven, but doesn't by itself resolve the aesthetic risk.

## Honest limitations (placeholder-stage, by design)

- The instruments are **synthesized stand-ins**, not real violin/mandolin/bassoon. They prove sync,
  structure, and reproducibility — not the aesthetic (that is risk 2, for human ears).
- Placeholder loops are mono, one 4-bar loop each at 90 BPM in Dm.
- No time-stretch: if a recipe `tempo` differs from a sound's `bpm`, the loop tiles at native length
  (a warning prints). Real recordings should be recorded at the drop tempo, or a stretch step added.
- Patterns live in `synth.mjs` for the placeholders; the recipe's `patternId` is carried as
  provenance but real recorded loops encode their own pattern in the audio.
