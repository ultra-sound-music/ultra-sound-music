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

## Repo Layout

- `apps/web` — main React 18 dApp / auction site.
- `apps/docs` — Docusaurus docs site.
- `apps/guillermo`, `apps/sandbox` — secondary or experimental apps.
- `libs/sol-client` — deprecated on-chain client layer to rewrite.
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

## Hard Constraints

- Do not revive the old Metaplex v1 Auction/Admin/Dao stack in `libs/sol-client`.
- Mint new bots using the current Metaplex Core standard unless the spec changes.
- Preserve the `USMAuctionData` shape in `libs/sol-client/src/lib/Auction/getAuction.ts` when
  replacing auction plumbing, so existing UI changes stay small.
- Anything touching real SOL is devnet-first and requires review before mainnet.
