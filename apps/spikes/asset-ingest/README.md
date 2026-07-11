# Asset-Ingest Spike

Turns one recorded session (raw WAVs + a hand-written `session.json`) into a validated
`SoundManifestEntry` + `SonicIdentity.SourceSession`, and upserts both into
`../band-jam/manifests/`. This is `.agents/plans/04-product-validation.md` item 0 — the pipeline
that gates the owner personally asking Vijatsu/Alisa Rose/Tristan Scroggins/Sebastian Chaves for
real recordings (`.agents/spec/jam-bots-drop.md`, `.agents/spec/vijay-recording-brief.md`).

Dependency-free, like `../sound-jam/` and `../band-jam/`: pure Node, no npm install needed.

## Cross-spike dependency (deliberate, not accidental)

This spike reads `../band-jam/src/wav.mjs` (WAV I/O) and `../band-jam/schema/*.schema.json`
(the manifest contract) by relative path, and writes directly into
`../band-jam/manifests/sound-manifest.json` / `sonic-identities.json`. Ingestion is upstream of the
render engine, so this coupling is intentional — band-jam itself began the same way, as a divergent
copy of `sound-jam`. `../band-jam/README.md` cross-references this back.

## Run it

```
npm run all    # test-ingest + verify-stereo
```

Individual steps:

| Script                               | Does                                                                                                                                                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run gen-test-intake`            | Fabricates 3 throwaway synthetic sessions (violin, mandolin, phase-inverted stereo) + a scratch copy of the real identities registry, all under `intake/`/`out/` (gitignored)          |
| `npm run ingest -- --session <path>` | Runs the real pipeline against one `session.json`                                                                                                                                      |
| `npm run test-ingest`                | `gen-test-intake` + ingest all 3 fake sessions into `out/test-*.json` — proves the pipeline without touching real data                                                                 |
| `npm run verify-stereo`              | Renders the ingested stereo fixture through the real `band-jam/src/jam.mjs` and asserts exact silence — proves stereo sources are actually downmixed, not just accepted at ingest time |
| `npm run all`                        | `test-ingest` + `verify-stereo`                                                                                                                                                        |

## Ingesting a real session

1. Create `intake/<name>/` with the raw WAVs (naming convention from
   `.agents/spec/vijay-recording-brief.md`: `{instrument}_{yyyy-mm-dd}_{take-or-piece-label}.wav`)
   and a hand-written `session.json` (shape: `schema/intake-session.ts`/`.schema.json`) — one hero
   take, one excerpt, 3-8 slices.
2. `sonicIdentityId` must already exist in `../band-jam/manifests/sonic-identities.json` — this tool
   ingests recordings for known Artists only; it doesn't register new ones.
3. Sanity-check first: `node src/ingest.mjs --session intake/<name>/session.json --dry-run` — prints
   the computed `SoundManifestEntry`/`SourceSession` without writing anything.
4. When it looks right: `node src/ingest.mjs --session intake/<name>/session.json` — writes/upserts
   into the real `../band-jam/manifests/` files (defaults for `--manifest-out`/`--identities-file`).

Re-running the same session is safe: the manifest entry upserts by `id`, and the identity's
`sourceSessions` upserts by `sessionId` — neither duplicates, and ingesting a second player's
session never erases a previously-ingested one.

## Mono or stereo — both accepted (2026-07-09)

The recording brief doesn't require mono, so this tool accepts either. `audio-stats.mjs` computes
peak/loudness across every channel present (not just channel 0). Stereo files are stored and
hashed **untouched** — `canonical-store/` always keeps the original channel count; the downmix to
mono happens only at render time, inside `band-jam/src/jam.mjs` (see that README's "Mono/stereo"
section), never here. This matters for reversibility: if full stereo width ever needs to survive
into the final mix instead of being downmixed, no real recording needs re-ingesting — it's a
render-engine change only, because the original file was never flattened at the ingestion/storage
layer.

## What it does NOT do (this pass)

- **Real Arweave/Irys upload.** `src/uploader.mjs`'s `LocalStubUploader` copies bytes into
  `canonical-store/<sha256>.wav` and returns a clearly-fake `stub://local/<hash>` URI — never
  confused with a real Arweave URI. No funded wallet exists yet and there's no real audio yet to
  justify the spend (owner decision, 2026-07-09). A future real uploader implements the same
  `upload()` shape using the already-installed `arweave` npm package with a local JWK keypair
  (Node-side signing, no browser wallet) — `libs/app-state/src/web3/arweave/api.ts` has the real
  transaction-upload mechanics as a reference (createTransaction → tag → sign → chunked upload), not
  code to import directly (that path needs a connected browser wallet).
- Audio transcoding/format conversion.
- Loop-point auto-detection — defaults to full-file length if `hero.loopPoints`'s end is omitted;
  real hero takes aren't guaranteed to loop seamlessly at full length the way the synthesized
  placeholders are (deliberately built with a loop-safe gap). Trimming/crossfade tooling is future
  work, not this tool's job.
- `approvedExtension` automation (off-instrument material flagged in the brief) — stays a manual,
  case-by-case hand-edit of the resulting manifest entry.
- A UI. CLI only, matching every other spike here.

## Why this validator is stricter than band-jam's

`../band-jam/src/jam.mjs`'s hand-rolled `validate()` only checks required-key-presence and enum
membership — it would silently accept a 1-element `tempoRange`, a negative `bpm`, or `peak > 1`.
Ingested data becomes semi-permanent provenance (real performers' one-of-a-kind recordings), so
`src/validate-intake.mjs` additionally enforces type, numeric bounds
(`minimum`/`maximum`/`exclusiveMinimum`/`exclusiveMaximum`), and array length
(`minItems`/`maxItems`) against the same `.schema.json` files. This doesn't touch or replace
`jam.mjs`'s existing validator — out of scope for this pass.

## `apps/guillermo` — checked, not reused

`apps/guillermo`'s mint/store/auction/proposal code is confirmed-dead Metaplex v1 (`AGENTS.md`
hard constraint, not revived). Its `UploadAssetsForm.tsx` calls real, working Arweave-upload code
(`libs/app-state/src/web3/arweave/api.ts`) — genuine, not a stub — but it's coupled to a connected
browser wallet (`arweave-wallet-connector`) and shaped for one image + one metadata JSON for the
old mint flow. Not directly reusable by this headless, batch, multi-file CLI; kept as the mechanics
reference for the future real uploader instead (see above).
