// Pluggable upload seam. `LocalStubUploader` is the only implementation until a
// funded Arweave/Irys wallet exists and there's real audio worth permanently
// pinning (owner decision, 2026-07-09 — no spend to justify yet). A future real
// uploader (e.g. `IrysUploader`/`ArweaveUploader`) implements the same `upload()`
// shape using the already-installed `arweave` npm package with a local JWK
// keypair (Node-side signing, no browser wallet needed) — see
// `libs/app-state/src/web3/arweave/api.ts` for the real transaction-upload
// mechanics (createTransaction -> tag -> sign -> chunked getUploader) as a
// reference, not code to import directly (that path is browser-wallet-coupled).
// Swapping the real uploader in later is a one-file change in `ingest.mjs`, not
// a rewrite.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

export class LocalStubUploader {
  constructor(storeDir) {
    this.storeDir = storeDir;
  }

  // buffer: Buffer; contentType: informational only for the stub.
  // Returns { canonicalUri, storedPath }. `storedPath` is a stub-only extra (a
  // real network uploader wouldn't have a meaningful local path) that the
  // caller uses to derive a local `playbackUri`.
  upload(buffer, contentType, { extension = 'wav' } = {}) {
    const hash = createHash('sha256').update(buffer).digest('hex');
    const storedPath = join(this.storeDir, `${hash}.${extension}`);
    if (!existsSync(this.storeDir)) mkdirSync(this.storeDir, { recursive: true });
    if (!existsSync(storedPath)) writeFileSync(storedPath, buffer);
    return {
      canonicalUri: `stub://local/${hash}`,
      storedPath
    };
  }
}
