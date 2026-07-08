# Sound-Jam Spike

Plan 04, workstream A (`.agents/plans/04-product-validation.md`). Proves the low-level **sound
transport** risk: can signature-sound instrument loops play in sync on a shared clock and render a
deterministic, shareable artifact — driven entirely by manifests, so real recordings replace the
placeholders with **zero code change**.

This directory is intentionally sound-level. It proves loading, scheduling, mixing, and
reproducibility for audio assets. The product-shaped artist/inventory resolver is staged separately
in `../band-jam/`.

Dependency-free: pure Node (no Tone.js, no Web Audio, no browser). Audio is synthesized and mixed by
writing PCM directly, then encoded to MP3 with the system `ffmpeg`. A sample-indexed clock makes the
render **bit-identical run to run**.

## Run it

```
cd apps/spikes/sound-jam
npm run all          # gen placeholders -> render jam -> encode mp3 -> verify determinism
```

Individual steps:

| Script                   | Does                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| `npm run gen`            | Render the 3 placeholder instrument loops + write the sound manifest |
| `npm run render`         | Sequence + mix the demo jam → `out/jam.wav`                          |
| `npm run render:ambient` | A second recipe (duo, more reverb) → `out/jam-ambient.wav`           |
| `npm run share`          | Encode `out/jam.wav` → `out/jam.mp3` (the shareable artifact)        |
| `npm run verify`         | Render twice, assert identical PCM (reproducibility gate)            |

**The shareable artifact is `out/jam.mp3`** (~43s). `out/jam-spectrogram.png` shows the structure.

## How it fits together (the seam)

```
schema/sound-manifest.{ts,schema.json}   <- canonical shape (blocker-decisions "Sound manifest")
schema/jam-recipe.{ts,schema.json}       <- sound-level render recipe shape

manifests/placeholder-sounds.json        <- sound manifest: id, signature role, bpm, key, loop points,
                                            credit, rights, hash, canonicalUri, playbackUri ...
manifests/demo-jam.json                  <- jam recipe: band/members, seed, tempo, key, tracks
                                            (performerArtistId + soundId + role + pattern + gain + pan),
                                            mix, engineVersion

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
- [ ] **(2)** At least one human outside the project has heard it — **needs a person** (send `out/jam.mp3`).
- [ ] **(3)** The D2 owner does an accept/reject listening pass against the D3 north star — **needs the D2/D3 decisions**.

Criteria 2 and 3 are deliberately not code — they are the ears the spike exists to put the artifact in front of.

## Honest limitations (placeholder-stage, by design)

- The instruments are **synthesized stand-ins**, not real violin/mandolin/bassoon. They prove sync,
  structure, and reproducibility — not the aesthetic (that is risk 2, for human ears).
- Placeholder loops are mono, one 4-bar loop each at 90 BPM in Dm.
- No time-stretch: if a recipe `tempo` differs from a sound's `bpm`, the loop tiles at native length
  (a warning prints). Real recordings should be recorded at the drop tempo, or a stretch step added.
- Patterns live in `synth.mjs` for the placeholders; the recipe's `patternId` is carried as
  provenance but real recorded loops encode their own pattern in the audio.
