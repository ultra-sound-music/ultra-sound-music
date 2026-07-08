# AGENTS.md — Ultra Sound Music

Canonical instructions for agents working in this repo. Keep this file stable and concise; put live
status, unresolved product details, and working notes in `.agents/`.

## Start Here

1. Read this file.
2. Read `.agents/current_status.md` for the latest state, open questions, and next task.
3. Read the relevant files in `.agents/plans/` and `.agents/spec/` before changing behavior.

Do not depend on tool-specific memory. If a fact should survive across sessions, write it to
`AGENTS.md` if stable, or `.agents/` if it is project state/spec/planning.

## Project

Ultra Sound Music is a Solana dApp for NFT musicians, starting with the Jam Bots drop. The intended
launch loop is: bots exist -> friends bid -> winners own -> owners play sounds / see stats / form
bands.

The frontend is mostly reusable. The old on-chain layer targets deprecated Metaplex v1 programs and
must be replaced rather than revived. Product specifics, trait taxonomy, drop mechanics, and open
questions live in `.agents/spec/` and `.agents/current_status.md`.

## Working Rules

- Keep `.agents/current_status.md` current after meaningful progress.
- Write durable discoveries to one focused file in `.agents/spec/`.
- Use `.agents/plans/` for roadmaps and implementation plans.
- Keep committed files (`AGENTS.md`, `CLAUDE.md`, `README.md`) for stable instructions only.
- **Pre-production — no back-compat burden.** Nothing is deployed yet (no mainnet; the auction
  program isn't on devnet either), so refactor freely: no compatibility shims, deprecation cycles,
  or data migrations — make the clean change directly. Preserving the `USMAuctionData` shape is an
  effort-saver (keeps UI churn small), not a compatibility rule. This freedom ends at deploy: once
  the program ships to devnet — and hard-stop at mainnet — on-chain account/IDL layout changes
  become real migrations.

## Repo Layout

- `apps/web` — main React 18 dApp / auction site.
- `apps/docs` — Docusaurus docs site.
- `apps/guillermo`, `apps/sandbox` — secondary or experimental apps.
- `apps/spikes` — standalone, dependency-free Node proof-of-concept mini-projects (each has its own
  `package.json`; not Nx-registered projects). `apps/spikes/sound-jam` is the completed sound-level
  jam transport proof; `apps/spikes/band-jam` is the active artist-aware iteration (trait-driven
  resolver). See `.agents/plans/04-product-validation.md` Workstream A.
- `libs/sol-client` — on-chain client layer. The Core/custom-auction adapter
  (`Auction/auctionAdapter.ts`, exporting `getAuction`) is the live read path. The old
  Metaplex-v1 `Auction/getAuction.ts` file is now only a compatibility re-export for shared types.
- `programs/usm-auction` — custom Anchor auction program (Rust) for Metaplex Core NFTs, plus its
  TypeScript test suite. Source of truth for the on-chain account layout the adapter mirrors.
- `libs/app-state` — web3 + UI app state.
- `libs/store` — Redux store.
- `libs/audio-player` — Web Audio playback.
- `libs/assets`, `libs/content`, `libs/ui`, `libs/components`, `libs/styles`, `libs/config`,
  `libs/services`, `libs/arweave`, `libs/util` — shared app libraries.

## Build / Run

- Use Node from `.nvmrc` (`v16.13.0`) unless intentionally updating the toolchain. Verified
  working 2026-06; no toolchain bump needed.
- Package manager: vendored Yarn 3.1.1 (`.yarn/releases`), bootstrapped via `corepack enable`;
  then `yarn install`.
- Serve web app: `npx nx serve web` -> http://localhost:4200.
- Auctions are gated behind `LFG=TRUE` in `apps/web/.env`.
- Tests: `nx test <project>`. E2E: Cypress.

### Auction program (Anchor)

The custom program lives in `programs/usm-auction` (Anchor 0.32, Solana 4.0.2, mpl-core 0.12).
Plain `anchor build` can fail: the default `cargo-build-sbf` ships a Cargo too old for an
`edition2024` transitive dep. Build/test with the pinned toolchain at the head of PATH:

```
SOLANA_4=~/.local/share/solana/install/releases/stable-549805f3e85f345c9df98d59759691443eef57aa/solana-release/bin
PATH="$SOLANA_4:$HOME/.avm/bin:$HOME/.cargo/bin:$PATH" anchor build   # or: anchor test
```

- `anchor test` runs the full lifecycle suite (`tests/usm_auction.ts`) on a local validator with the
  Core program loaded from `target/core.so`.
- `cargo check` (host cargo) type-checks the program quickly without the SBF toolchain.
- Regenerate the IDL with `anchor idl build -o <file>` (host cargo works), then keep the committed
  copies in `libs/sol-client/src/Auction/` (`usm_auction_idl.json`, `usm_auction_types.ts`) in sync.

## Hard Constraints

- Do not revive the old Metaplex v1 Auction/Admin/Dao stack in `libs/sol-client`.
- Mint new bots using the current Metaplex Core standard unless the spec changes.
- Preserve the `USMAuctionData` shape in `libs/sol-client/src/Auction/getAuction.ts` when
  replacing auction plumbing, so existing UI changes stay small.
- The adapter (`libs/sol-client/src/Auction/auctionAdapter.ts`) hand-mirrors the program's account
  byte layout (`programs/usm-auction/.../state.rs`). If you change the on-chain layout, update the
  adapter offsets and regenerate the IDL in lockstep — they drift silently.
- Anything touching real SOL is devnet-first and requires review before mainnet.
