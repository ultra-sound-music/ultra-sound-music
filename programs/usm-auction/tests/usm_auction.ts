import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  SYSVAR_CLOCK_PUBKEY,
} from "@solana/web3.js";
import { assert } from "chai";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createCollection,
  create,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  sol as umiSol,
} from "@metaplex-foundation/umi";
import {
  fromWeb3JsKeypair,
  toWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import { UsmAuction } from "../target/types/usm_auction";

// ─── Constants ───────────────────────────────────────────────────────────────
const RESERVE = 1 * LAMPORTS_PER_SOL;
const TICK = 0.1 * LAMPORTS_PER_SOL;
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function auctionPDA(
  assetPk: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("auction"), assetPk.toBuffer()],
    programId
  );
}

function bidPDA(
  auctionPk: PublicKey,
  bidderPk: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("bid"), auctionPk.toBuffer(), bidderPk.toBuffer()],
    programId
  );
}

async function airdrop(
  connection: anchor.web3.Connection,
  pk: PublicKey,
  lamports: number
): Promise<void> {
  const sig = await connection.requestAirdrop(pk, lamports);
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
}

/** Mint a Core collection + asset owned by seller, return their pubkeys. */
async function mintCoreAsset(
  connection: anchor.web3.Connection,
  sellerKp: Keypair
): Promise<{ asset: PublicKey; collection: PublicKey }> {
  const umi = createUmi(connection).use(
    keypairIdentity(fromWeb3JsKeypair(sellerKp))
  );
  const { mplCore } = await import("@metaplex-foundation/mpl-core");
  umi.use(mplCore());

  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Test Collection",
    uri: "https://example.com/collection.json",
  }).sendAndConfirm(umi);

  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collectionSigner,
    name: "Test Asset",
    uri: "https://example.com/asset.json",
  }).sendAndConfirm(umi);

  return {
    asset: toWeb3JsPublicKey(assetSigner.publicKey),
    collection: toWeb3JsPublicKey(collectionSigner.publicKey),
  };
}

/** Return unix timestamp (seconds) delta seconds from system clock. */
function ts(deltaSec: number): anchor.BN {
  return new anchor.BN(Math.floor(Date.now() / 1000) + deltaSec);
}

/** Read the Clock sysvar unix_timestamp — the same value Clock::get() returns in programs. */
async function validatorNow(connection: anchor.web3.Connection): Promise<number> {
  const info = await connection.getAccountInfo(SYSVAR_CLOCK_PUBKEY, "confirmed");
  if (!info) throw new Error("Could not read Clock sysvar");
  // Clock layout: slot(u64,0) + epoch_start_timestamp(i64,8) + epoch(u64,16) + leader_schedule_epoch(u64,24) + unix_timestamp(i64,32)
  return Number(info.data.readBigInt64LE(32));
}

async function createAuction(
  program: Program<UsmAuction>,
  {
    seller,
    asset,
    collection,
    treasury,
    reserve = RESERVE,
    tick = TICK,
    startDelta = -10,
    endDelta = 3600,
  }: {
    seller: Keypair;
    asset: PublicKey;
    collection: PublicKey;
    treasury: PublicKey;
    reserve?: number;
    tick?: number;
    startDelta?: number;
    endDelta?: number;
  }
): Promise<PublicKey> {
  const connection = (program.provider as anchor.AnchorProvider).connection;
  const now = await validatorNow(connection);
  const [auctionPk] = auctionPDA(asset, program.programId);
  await program.methods
    .createAuction(
      new anchor.BN(reserve),
      new anchor.BN(tick),
      new anchor.BN(now + startDelta),
      new anchor.BN(now + endDelta),
      treasury
    )
    .accounts({
      seller: seller.publicKey,
      asset,
      collection,
      auction: auctionPk,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([seller])
    .rpc();
  return auctionPk;
}

async function placeBid(
  program: Program<UsmAuction>,
  {
    bidder,
    auctionPk,
    amount,
  }: { bidder: Keypair; auctionPk: PublicKey; amount: number }
): Promise<PublicKey> {
  const [bidPk] = bidPDA(auctionPk, bidder.publicKey, program.programId);
  await program.methods
    .placeBid(new anchor.BN(amount))
    .accounts({
      bidder: bidder.publicKey,
      auction: auctionPk,
      bid: bidPk,
      systemProgram: SystemProgram.programId,
    })
    .signers([bidder])
    .rpc();
  return bidPk;
}

/** Poll the Clock sysvar until the validator clock is past the auction's end_time.
 * Timeout: 700 seconds (handles endDelta up to ~660s after bids + setup). */
async function expireAuction(
  program: Program<UsmAuction>,
  auctionPk: PublicKey,
  provider: anchor.AnchorProvider
): Promise<void> {
  const auction = await program.account.auction.fetch(auctionPk);
  const endTime = auction.endTime.toNumber();
  let lastClock = 0;
  for (let i = 0; i < 1400; i++) {
    try {
      const clock = await validatorNow(provider.connection);
      lastClock = clock;
      if (clock > endTime) return;
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(
    `Timed out waiting for auction (endTime ${endTime}) to expire. lastClock=${lastClock}`
  );
}

// ─── Test suite ──────────────────────────────────────────────────────────────

describe("usm-auction", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.UsmAuction as Program<UsmAuction>;

  const seller = Keypair.generate();
  const bidder1 = Keypair.generate();
  const bidder2 = Keypair.generate();
  const treasury = Keypair.generate();

  before(async () => {
    for (const kp of [seller, bidder1, bidder2, treasury]) {
      await airdrop(provider.connection, kp.publicKey, 10 * LAMPORTS_PER_SOL);
    }
  });

  // ── create_auction ──────────────────────────────────────────────────────

  describe("create_auction", () => {
    let asset: PublicKey;
    let collection: PublicKey;

    before(async () => {
      ({ asset, collection } = await mintCoreAsset(provider.connection, seller));
    });

    it("creates an auction and transfers the Core asset to escrow", async () => {
      const [auctionPk] = auctionPDA(asset, program.programId);
      await createAuction(program, {
        seller,
        asset,
        collection,
        treasury: treasury.publicKey,
      });

      const auction = await program.account.auction.fetch(auctionPk);
      assert.ok(auction.seller.equals(seller.publicKey));
      assert.ok(auction.asset.equals(asset));
      assert.ok(auction.collection.equals(collection));
      assert.ok(auction.treasury.equals(treasury.publicKey));
      assert.equal(auction.reserve.toNumber(), RESERVE);
      assert.equal(auction.tick.toNumber(), TICK);
      assert.equal(auction.bidCount.toNumber(), 0);
      assert.deepEqual(auction.state, { active: {} });

      // Core asset owner should now be the auction PDA
      const assetAccount = await fetchAssetV1(
        createUmi(provider.connection),
        asset
      );
      assert.ok(
        toWeb3JsPublicKey(assetAccount.owner).equals(auctionPk),
        "asset owner should be auction PDA"
      );
    });

    it("rejects when reserve is 0", async () => {
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      try {
        await createAuction(program, {
          seller,
          asset: a2,
          collection: c2,
          treasury: treasury.publicKey,
          reserve: 0,
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "BidBelowReserve");
      }
    });

    it("rejects when tick is 0", async () => {
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      try {
        await createAuction(program, {
          seller,
          asset: a2,
          collection: c2,
          treasury: treasury.publicKey,
          tick: 0,
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "BidBelowTick");
      }
    });

    it("rejects when end_time <= start_time", async () => {
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const [auctionPk] = auctionPDA(a2, program.programId);
      try {
        await program.methods
          .createAuction(
            new anchor.BN(RESERVE),
            new anchor.BN(TICK),
            ts(100),
            ts(50), // end before start
            treasury.publicKey
          )
          .accounts({
            seller: seller.publicKey,
            asset: a2,
            collection: c2,
            auction: auctionPk,
            mplCoreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([seller])
          .rpc();
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "InvalidEndTime");
      }
    });

    it("rejects when asset does not belong to the collection", async () => {
      const { asset: a2 } = await mintCoreAsset(provider.connection, seller);
      const { collection: wrongCollection } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const [auctionPk] = auctionPDA(a2, program.programId);
      try {
        await program.methods
          .createAuction(
            new anchor.BN(RESERVE),
            new anchor.BN(TICK),
            ts(-10),
            ts(3600),
            treasury.publicKey
          )
          .accounts({
            seller: seller.publicKey,
            asset: a2,
            collection: wrongCollection,
            auction: auctionPk,
            mplCoreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([seller])
          .rpc();
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "WrongCollection");
      }
    });
  });

  // ── place_bid ────────────────────────────────────────────────────────────

  describe("place_bid", () => {
    let asset: PublicKey;
    let collection: PublicKey;
    let auctionPk: PublicKey;

    before(async () => {
      ({ asset, collection } = await mintCoreAsset(provider.connection, seller));
      auctionPk = await createAuction(program, {
        seller,
        asset,
        collection,
        treasury: treasury.publicKey,
      });
    });

    it("accepts a first bid at reserve", async () => {
      const bidPk = await placeBid(program, {
        bidder: bidder1,
        auctionPk,
        amount: RESERVE,
      });

      const auction = await program.account.auction.fetch(auctionPk);
      assert.ok(auction.highestBidder.equals(bidder1.publicKey));
      assert.equal(auction.highestBid.toNumber(), RESERVE);
      assert.equal(auction.bidCount.toNumber(), 1);

      const bid = await program.account.bid.fetch(bidPk);
      assert.ok(bid.bidder.equals(bidder1.publicKey));
      assert.equal(bid.amount.toNumber(), RESERVE);
    });

    it("rejects a first bid below reserve", async () => {
      // Use a fresh auction for this
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const freshAuction = await createAuction(program, {
        seller,
        asset: a2,
        collection: c2,
        treasury: treasury.publicKey,
      });
      try {
        await placeBid(program, {
          bidder: bidder1,
          auctionPk: freshAuction,
          amount: RESERVE - 1,
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "BidBelowReserve");
      }
    });

    it("accepts a second bid meeting reserve + tick", async () => {
      const secondBid = RESERVE + TICK;
      const bidPk = await placeBid(program, {
        bidder: bidder2,
        auctionPk,
        amount: secondBid,
      });

      const auction = await program.account.auction.fetch(auctionPk);
      assert.ok(auction.highestBidder.equals(bidder2.publicKey));
      assert.equal(auction.highestBid.toNumber(), secondBid);
      assert.equal(auction.bidCount.toNumber(), 2);
    });

    it("rejects a second bid below reserve + tick", async () => {
      // New auction with one existing bid
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const freshAuction = await createAuction(program, {
        seller,
        asset: a2,
        collection: c2,
        treasury: treasury.publicKey,
      });
      await placeBid(program, { bidder: bidder1, auctionPk: freshAuction, amount: RESERVE });

      try {
        await placeBid(program, {
          bidder: bidder2,
          auctionPk: freshAuction,
          amount: RESERVE + TICK - 1,
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "BidBelowTick");
      }
    });

    it("allows the same bidder to increase their bid", async () => {
      // bidder2 is currently highest at RESERVE + TICK in the main auction
      const before = await program.account.bid.fetch(
        bidPDA(auctionPk, bidder2.publicKey, program.programId)[0]
      );
      const newAmount = before.amount.toNumber() + TICK;

      await placeBid(program, {
        bidder: bidder2,
        auctionPk,
        amount: newAmount,
      });

      const after = await program.account.bid.fetch(
        bidPDA(auctionPk, bidder2.publicKey, program.programId)[0]
      );
      assert.equal(after.amount.toNumber(), newAmount);
      // bid_count should NOT increment for same bidder
      const auction = await program.account.auction.fetch(auctionPk);
      assert.equal(auction.bidCount.toNumber(), 2);
    });

    it("rejects a same-bidder bid that does not exceed their previous amount", async () => {
      const [bidPk] = bidPDA(auctionPk, bidder2.publicKey, program.programId);
      const current = await program.account.bid.fetch(bidPk);
      try {
        await placeBid(program, {
          bidder: bidder2,
          auctionPk,
          amount: current.amount.toNumber(), // same as current, not higher
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "BidTooLow");
      }
    });

    it("rejects a bid before start_time", async () => {
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const [futureAuctionPk] = auctionPDA(a2, program.programId);
      // start 1 hour from now
      await program.methods
        .createAuction(
          new anchor.BN(RESERVE),
          new anchor.BN(TICK),
          ts(3600),
          ts(7200),
          treasury.publicKey
        )
        .accounts({
          seller: seller.publicKey,
          asset: a2,
          collection: c2,
          auction: futureAuctionPk,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([seller])
        .rpc();

      try {
        await placeBid(program, {
          bidder: bidder1,
          auctionPk: futureAuctionPk,
          amount: RESERVE,
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "AuctionNotStarted");
      }
    });

    it("rejects a bid after end_time", async () => {
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      // Create an already-expired auction (start 30s ago, ended 5s ago)
      const expiredAuction = await createAuction(program, {
        seller,
        asset: a2,
        collection: c2,
        treasury: treasury.publicKey,
        startDelta: -30,
        endDelta: -5,
      });

      try {
        await placeBid(program, {
          bidder: bidder1,
          auctionPk: expiredAuction,
          amount: RESERVE,
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "AuctionEnded");
      }
    });

    it("extends end_time by 600s when bid lands within 600s of end", async () => {
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      // Auction ends in 300s (within snipe window)
      const snipeAuction = await createAuction(program, {
        seller,
        asset: a2,
        collection: c2,
        treasury: treasury.publicKey,
        endDelta: 300,
      });

      const before = await program.account.auction.fetch(snipeAuction);
      const originalEnd = before.endTime.toNumber();

      await placeBid(program, {
        bidder: bidder1,
        auctionPk: snipeAuction,
        amount: RESERVE,
      });

      const after = await program.account.auction.fetch(snipeAuction);
      assert.equal(
        after.endTime.toNumber(),
        originalEnd + 600,
        "end_time should be extended by 600s"
      );
    });

    it("does not extend end_time when bid is earlier than the snipe window", async () => {
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      // Auction ends in 1 hour (outside snipe window)
      const safeAuction = await createAuction(program, {
        seller,
        asset: a2,
        collection: c2,
        treasury: treasury.publicKey,
        endDelta: 3600,
      });

      const before = await program.account.auction.fetch(safeAuction);
      const originalEnd = before.endTime.toNumber();

      await placeBid(program, {
        bidder: bidder1,
        auctionPk: safeAuction,
        amount: RESERVE,
      });

      const after = await program.account.auction.fetch(safeAuction);
      assert.equal(
        after.endTime.toNumber(),
        originalEnd,
        "end_time should NOT be extended"
      );
    });

    it("tracks bid_count correctly (unique bidders only)", async () => {
      // Use the main auction which already has bidder1 + bidder2
      const auction = await program.account.auction.fetch(auctionPk);
      const countBefore = auction.bidCount.toNumber();

      // bidder2 increases their bid — should NOT bump bid_count
      const [bidder2BidPk] = bidPDA(auctionPk, bidder2.publicKey, program.programId);
      const current = await program.account.bid.fetch(bidder2BidPk);
      await placeBid(program, {
        bidder: bidder2,
        auctionPk,
        amount: current.amount.toNumber() + TICK,
      });

      const after = await program.account.auction.fetch(auctionPk);
      assert.equal(after.bidCount.toNumber(), countBefore);
    });
  });

  // ── cancel_auction ───────────────────────────────────────────────────────

  describe("cancel_auction", () => {
    it("cancels a zero-bid auction and returns asset to seller", async () => {
      const { asset, collection } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const auctionPk = await createAuction(program, {
        seller,
        asset,
        collection,
        treasury: treasury.publicKey,
      });

      await program.methods
        .cancelAuction()
        .accounts({
          seller: seller.publicKey,
          auction: auctionPk,
          asset,
          collection,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([seller])
        .rpc();

      // Auction PDA should be closed
      const auctionInfo = await provider.connection.getAccountInfo(auctionPk);
      assert.isNull(auctionInfo, "auction PDA should be closed");

      // Asset returned to seller
      const assetAccount = await fetchAssetV1(
        createUmi(provider.connection),
        asset
      );
      assert.ok(
        toWeb3JsPublicKey(assetAccount.owner).equals(seller.publicKey),
        "asset owner should be back to seller"
      );
    });

    it("rejects cancel when there are bids", async () => {
      const { asset, collection } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const auctionPk = await createAuction(program, {
        seller,
        asset,
        collection,
        treasury: treasury.publicKey,
      });
      await placeBid(program, { bidder: bidder1, auctionPk, amount: RESERVE });

      try {
        await program.methods
          .cancelAuction()
          .accounts({
            seller: seller.publicKey,
            auction: auctionPk,
            asset,
            collection,
            mplCoreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([seller])
          .rpc();
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "CancelWithBids");
      }
    });

    it("rejects cancel by non-seller", async () => {
      const { asset, collection } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const auctionPk = await createAuction(program, {
        seller,
        asset,
        collection,
        treasury: treasury.publicKey,
      });

      try {
        await program.methods
          .cancelAuction()
          .accounts({
            seller: seller.publicKey,
            auction: auctionPk,
            asset,
            collection,
            mplCoreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([bidder1]) // wrong signer
          .rpc();
        assert.fail("should have thrown");
      } catch (err) {
        // Anchor will reject because bidder1 is not the `seller` account signer
        assert.ok(err);
      }
    });
  });

  // ── claim_refund ─────────────────────────────────────────────────────────

  describe("claim_refund", () => {
    let asset: PublicKey;
    let collection: PublicKey;
    let auctionPk: PublicKey;
    let bidder1BidPk: PublicKey;
    let bidder2BidPk: PublicKey;

    before(async () => {
      ({ asset, collection } = await mintCoreAsset(provider.connection, seller));
      auctionPk = await createAuction(program, {
        seller,
        asset,
        collection,
        treasury: treasury.publicKey,
      });
      // bidder1 bids first at reserve
      bidder1BidPk = await placeBid(program, {
        bidder: bidder1,
        auctionPk,
        amount: RESERVE,
      });
      // bidder2 outbids
      bidder2BidPk = await placeBid(program, {
        bidder: bidder2,
        auctionPk,
        amount: RESERVE + TICK,
      });
    });

    it("allows an outbid bidder to claim a full refund", async () => {
      const balanceBefore = await provider.connection.getBalance(
        bidder1.publicKey
      );

      await program.methods
        .claimRefund()
        .accounts({
          bidder: bidder1.publicKey,
          auction: auctionPk,
          bid: bidder1BidPk,
        })
        .rpc();

      const balanceAfter = await provider.connection.getBalance(
        bidder1.publicKey
      );
      // Balance should have increased by approximately RESERVE (minus negligible gas)
      assert.ok(
        balanceAfter > balanceBefore,
        "bidder1 should receive lamports back"
      );

      // Bid PDA should be closed
      const bidInfo = await provider.connection.getAccountInfo(bidder1BidPk);
      assert.isNull(bidInfo, "bid PDA should be closed after refund");
    });

    it("rejects refund for the current highest bidder on an active auction", async () => {
      try {
        await program.methods
          .claimRefund()
          .accounts({
            bidder: bidder2.publicKey,
            auction: auctionPk,
            bid: bidder2BidPk,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "RefundDenied");
      }
    });

    it("allows anyone to crank the refund on behalf of a bidder", async () => {
      // Create a new auction with two bidders, let one be outbid
      const { asset: a2, collection: c2 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const ap = await createAuction(program, {
        seller,
        asset: a2,
        collection: c2,
        treasury: treasury.publicKey,
      });
      const b1pk = await placeBid(program, { bidder: bidder1, auctionPk: ap, amount: RESERVE });
      await placeBid(program, { bidder: bidder2, auctionPk: ap, amount: RESERVE + TICK });

      // Provider wallet (a third party, not the bidder) cranks bidder1's refund
      await program.methods
        .claimRefund()
        .accounts({
          bidder: bidder1.publicKey,
          auction: ap,
          bid: b1pk,
        })
        .rpc();

      const bidInfo = await provider.connection.getAccountInfo(b1pk);
      assert.isNull(bidInfo, "bid PDA should be closed");
    });

    it("is idempotent (second refund call fails: account already closed)", async () => {
      // bidder1BidPk was already closed in the first test above
      try {
        await program.methods
          .claimRefund()
          .accounts({
            bidder: bidder1.publicKey,
            auction: auctionPk,
            bid: bidder1BidPk,
          })
          .rpc();
        assert.fail("should have thrown");
      } catch (err) {
        assert.ok(err);
      }
    });
  });

  // ── settle ───────────────────────────────────────────────────────────────

  describe("settle", () => {
    // Pre-expired auctions with bids set up in before hook.
    // endDelta = 620 ensures time_left ≈ 615 ≥ 600 when bids land → anti-snipe does NOT fire.
    // All three expire at ~the same time; expireAuction on any one covers all.
    let settleAuction1: PublicKey, settleAsset1: PublicKey, settleCollection1: PublicKey;
    let settleAuction2: PublicKey, settleAsset2: PublicKey, settleCollection2: PublicKey;
    let settleAuction3: PublicKey, settleAsset3: PublicKey, settleCollection3: PublicKey;

    before(async () => {
      const [m1, m2, m3] = await Promise.all([
        mintCoreAsset(provider.connection, seller),
        mintCoreAsset(provider.connection, seller),
        mintCoreAsset(provider.connection, seller),
      ]);
      [settleAsset1, settleCollection1] = [m1.asset, m1.collection];
      [settleAsset2, settleCollection2] = [m2.asset, m2.collection];
      [settleAsset3, settleCollection3] = [m3.asset, m3.collection];

      [settleAuction1, settleAuction2, settleAuction3] = await Promise.all([
        createAuction(program, { seller, asset: settleAsset1, collection: settleCollection1, treasury: treasury.publicKey, endDelta: 620 }),
        createAuction(program, { seller, asset: settleAsset2, collection: settleCollection2, treasury: treasury.publicKey, endDelta: 620 }),
        createAuction(program, { seller, asset: settleAsset3, collection: settleCollection3, treasury: treasury.publicKey, endDelta: 620 }),
      ]);

      // Bids land when time_left ≈ 615 ≥ 600 → anti-snipe does not extend endTime
      await Promise.all([
        placeBid(program, { bidder: bidder1, auctionPk: settleAuction1, amount: RESERVE }),
        placeBid(program, { bidder: bidder1, auctionPk: settleAuction2, amount: RESERVE }),
        placeBid(program, { bidder: bidder1, auctionPk: settleAuction3, amount: RESERVE }),
      ]);

      // Expire all three (parallel-created auctions may have endTimes 1-2s apart;
      // waiting on each ensures none are checked before fully expired)
      await expireAuction(program, settleAuction1, provider);
      await expireAuction(program, settleAuction2, provider);
      await expireAuction(program, settleAuction3, provider);
    });

    it("settles a completed auction: sends asset to winner, SOL to treasury", async () => {
      const [winnerBidPk] = bidPDA(settleAuction1, bidder1.publicKey, program.programId);
      const treasuryBefore = await provider.connection.getBalance(treasury.publicKey);

      await program.methods
        .settle()
        .accounts({
          payer: bidder2.publicKey,
          auction: settleAuction1,
          seller: seller.publicKey,
          winner: bidder1.publicKey,
          winnerBid: winnerBidPk,
          treasury: treasury.publicKey,
          asset: settleAsset1,
          collection: settleCollection1,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([bidder2])
        .rpc();

      const auction = await program.account.auction.fetch(settleAuction1);
      assert.deepEqual(auction.state, { settled: {} });
      const treasuryAfter = await provider.connection.getBalance(treasury.publicKey);
      assert.ok(treasuryAfter > treasuryBefore, "treasury should have received SOL");
      const assetAccount = await fetchAssetV1(createUmi(provider.connection), settleAsset1);
      assert.ok(toWeb3JsPublicKey(assetAccount.owner).equals(bidder1.publicKey), "winner should own the asset");
    });

    it("cancels when settled with zero bids: returns asset to seller", async () => {
      const { asset, collection } = await mintCoreAsset(provider.connection, seller);
      // No bid → no anti-snipe → endDelta:15 expires in 15s, well within the 700s poll window
      const auctionPk = await createAuction(program, {
        seller, asset, collection, treasury: treasury.publicKey, endDelta: 15,
      });
      await expireAuction(program, auctionPk, provider);

      await program.methods
        .settle()
        .accounts({
          payer: bidder1.publicKey,
          auction: auctionPk,
          seller: seller.publicKey,
          winner: seller.publicKey,
          winnerBid: bidder1.publicKey,
          treasury: treasury.publicKey,
          asset,
          collection,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([bidder1])
        .rpc();

      const auction = await program.account.auction.fetch(auctionPk);
      assert.deepEqual(auction.state, { cancelled: {} });
      const assetAccount = await fetchAssetV1(createUmi(provider.connection), asset);
      assert.ok(toWeb3JsPublicKey(assetAccount.owner).equals(seller.publicKey), "asset should return to seller");
    });

    it("rejects settle before end_time", async () => {
      const { asset, collection } = await mintCoreAsset(provider.connection, seller);
      const auctionPk = await createAuction(program, {
        seller, asset, collection, treasury: treasury.publicKey, endDelta: 3600,
      });
      try {
        await program.methods
          .settle()
          .accounts({
            payer: bidder1.publicKey,
            auction: auctionPk,
            seller: seller.publicKey,
            winner: seller.publicKey,
            winnerBid: bidder1.publicKey,
            treasury: treasury.publicKey,
            asset,
            collection,
            mplCoreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([bidder1])
          .rpc();
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "AuctionNotEnded");
      }
    });

    it("rejects settle on an already-settled auction", async () => {
      const [winnerBidPk] = bidPDA(settleAuction2, bidder1.publicKey, program.programId);
      const settleAccounts = {
        payer: bidder2.publicKey,
        auction: settleAuction2,
        seller: seller.publicKey,
        winner: bidder1.publicKey,
        winnerBid: winnerBidPk,
        treasury: treasury.publicKey,
        asset: settleAsset2,
        collection: settleCollection2,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      };
      await program.methods.settle().accounts(settleAccounts).signers([bidder2]).rpc();
      try {
        await program.methods.settle().accounts(settleAccounts).signers([bidder2]).rpc();
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "AuctionAlreadyFinalised");
      }
    });

    it("is callable by anyone (permissionless)", async () => {
      const [winnerBidPk] = bidPDA(settleAuction3, bidder1.publicKey, program.programId);
      await program.methods
        .settle()
        .accounts({
          payer: treasury.publicKey,
          auction: settleAuction3,
          seller: seller.publicKey,
          winner: bidder1.publicKey,
          winnerBid: winnerBidPk,
          treasury: treasury.publicKey,
          asset: settleAsset3,
          collection: settleCollection3,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([treasury])
        .rpc();
      const auction = await program.account.auction.fetch(settleAuction3);
      assert.deepEqual(auction.state, { settled: {} });
    });
  });

  // ── edge cases ───────────────────────────────────────────────────────────

  describe("edge cases", () => {
    // Pre-expired auction states for tests that need expiry.
    // endDelta = 660 gives time_left ≈ 650 when bids land (even with 5 sequential bids)
    // so 650 ≥ 600 and anti-snipe does NOT fire. All three expire at ~the same time.
    let ecAsset1: PublicKey, ecCollection1: PublicKey, ec1Pk: PublicKey, ec1b1Pk: PublicKey;
    let ecAsset2: PublicKey, ecCollection2: PublicKey, ec2Pk: PublicKey;
    let ec2b1Pk: PublicKey, ec2b2Pk: PublicKey;
    let ecAsset3: PublicKey, ecCollection3: PublicKey, ec3Pk: PublicKey;
    let ec3b1Pk: PublicKey, ec3b2Pk: PublicKey;

    before(async () => {
      for (const kp of [seller, bidder1, bidder2, treasury]) {
        await airdrop(provider.connection, kp.publicKey, 20 * LAMPORTS_PER_SOL);
      }

      const [m1, m2, m3] = await Promise.all([
        mintCoreAsset(provider.connection, seller),
        mintCoreAsset(provider.connection, seller),
        mintCoreAsset(provider.connection, seller),
      ]);
      [ecAsset1, ecCollection1] = [m1.asset, m1.collection];
      [ecAsset2, ecCollection2] = [m2.asset, m2.collection];
      [ecAsset3, ecCollection3] = [m3.asset, m3.collection];

      [ec1Pk, ec2Pk, ec3Pk] = await Promise.all([
        createAuction(program, { seller, asset: ecAsset1, collection: ecCollection1, treasury: treasury.publicKey, endDelta: 660 }),
        createAuction(program, { seller, asset: ecAsset2, collection: ecCollection2, treasury: treasury.publicKey, endDelta: 660 }),
        createAuction(program, { seller, asset: ecAsset3, collection: ecCollection3, treasury: treasury.publicKey, endDelta: 660 }),
      ]);

      // First-round bids in parallel (different auctions → no conflicts)
      [ec1b1Pk, ec2b1Pk, ec3b1Pk] = await Promise.all([
        placeBid(program, { bidder: bidder1, auctionPk: ec1Pk, amount: RESERVE }),
        placeBid(program, { bidder: bidder1, auctionPk: ec2Pk, amount: RESERVE }),
        placeBid(program, { bidder: bidder1, auctionPk: ec3Pk, amount: RESERVE }),
      ]);
      // Second-round bids (bidder2 outbids bidder1 on ec2 and ec3)
      [ec2b2Pk, ec3b2Pk] = await Promise.all([
        placeBid(program, { bidder: bidder2, auctionPk: ec2Pk, amount: RESERVE + TICK }),
        placeBid(program, { bidder: bidder2, auctionPk: ec3Pk, amount: RESERVE + TICK }),
      ]);

      // SOL-conservation test: bidder1 claims refund on ec2 BEFORE settle
      await program.methods.claimRefund()
        .accounts({ bidder: bidder1.publicKey, auction: ec2Pk, bid: ec2b1Pk })
        .rpc();

      // Expire all three (parallel-created auctions may have endTimes 1-2s apart)
      await expireAuction(program, ec1Pk, provider);
      await expireAuction(program, ec2Pk, provider);
      await expireAuction(program, ec3Pk, provider);
    });

    it("handles a single bidder correctly (bid at reserve, settles to winner)", async () => {
      await program.methods
        .settle()
        .accounts({
          payer: seller.publicKey,
          auction: ec1Pk,
          seller: seller.publicKey,
          winner: bidder1.publicKey,
          winnerBid: ec1b1Pk,
          treasury: treasury.publicKey,
          asset: ecAsset1,
          collection: ecCollection1,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([seller])
        .rpc();

      const auction = await program.account.auction.fetch(ec1Pk);
      assert.deepEqual(auction.state, { settled: {} });
      assert.ok(auction.highestBidder.equals(bidder1.publicKey));
    });

    it("handles rapid anti-snipe: bid within 600s extends end, bid outside window does not", async () => {
      const { asset, collection } = await mintCoreAsset(
        provider.connection,
        seller
      );
      // endDelta: 300 — bid lands within the 600s anti-snipe window → extends by 600
      const auctionPk = await createAuction(program, {
        seller,
        asset,
        collection,
        treasury: treasury.publicKey,
        endDelta: 300,
      });

      const before = await program.account.auction.fetch(auctionPk);
      const originalEnd = before.endTime.toNumber();

      // bidder1 bids — time_left ≈ 300 < 600, extends to originalEnd + 600
      await placeBid(program, { bidder: bidder1, auctionPk, amount: RESERVE });
      const after1 = await program.account.auction.fetch(auctionPk);
      assert.equal(after1.endTime.toNumber(), originalEnd + 600);

      // bidder2 bids immediately — time_left ≈ 900 > 600, no further extension
      await placeBid(program, {
        bidder: bidder2,
        auctionPk,
        amount: RESERVE + TICK,
      });
      const after2 = await program.account.auction.fetch(auctionPk);
      assert.equal(after2.endTime.toNumber(), originalEnd + 600);
    });

    it("all SOL is accounted for at end of lifecycle (lamport conservation)", async () => {
      // Snapshot the two accounts we assert on across settle. The winner bid PDA (ec2b2Pk)
      // is closed: the winning bid goes to treasury and the rent is returned to the winner
      // (bidder2, not snapshotted), so the small rent delta is absorbed by feesAllowance below.
      // We snapshot right before settle so other tests' bids don't pollute the check.
      const [preTreasury, preEc2b2] = await Promise.all([
        provider.connection.getBalance(treasury.publicKey),
        provider.connection.getBalance(ec2b2Pk),
      ]);

      // Settle ec2: bidder2 wins (bidder1 already claimed refund in before hook)
      await program.methods
        .settle()
        .accounts({
          payer: treasury.publicKey,
          auction: ec2Pk,
          seller: seller.publicKey,
          winner: bidder2.publicKey,
          winnerBid: ec2b2Pk,
          treasury: treasury.publicKey,
          asset: ecAsset2,
          collection: ecCollection2,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([treasury])
        .rpc();

      const [postTreasury, postEc2b2] = await Promise.all([
        provider.connection.getBalance(treasury.publicKey),
        provider.connection.getBalance(ec2b2Pk),
      ]);

      // bid PDA must be fully drained
      assert.equal(postEc2b2, 0, "winner bid PDA should be drained");

      // treasury received bid lamports minus the tx fee it paid as payer
      const feesAllowance = 0.01 * LAMPORTS_PER_SOL;
      assert.ok(
        preTreasury + preEc2b2 - postTreasury < feesAllowance,
        `SOL not conserved across settle: net loss ${((preTreasury + preEc2b2 - postTreasury) / LAMPORTS_PER_SOL).toFixed(6)} SOL`
      );
      assert.ok(postTreasury <= preTreasury + preEc2b2, "no SOL should be created");
    });

    it("bid PDAs from a settled auction can still be refunded by losers", async () => {
      // Settle ec3: bidder2 wins
      await program.methods
        .settle()
        .accounts({
          payer: seller.publicKey,
          auction: ec3Pk,
          seller: seller.publicKey,
          winner: bidder2.publicKey,
          winnerBid: ec3b2Pk,
          treasury: treasury.publicKey,
          asset: ecAsset3,
          collection: ecCollection3,
          mplCoreProgram: MPL_CORE_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([seller])
        .rpc();

      // bidder1 claims refund on ec3 after settle
      const balBefore = await provider.connection.getBalance(bidder1.publicKey);
      await program.methods
        .claimRefund()
        .accounts({ bidder: bidder1.publicKey, auction: ec3Pk, bid: ec3b1Pk })
        .rpc();
      const balAfter = await provider.connection.getBalance(bidder1.publicKey);
      assert.ok(balAfter > balBefore, "bidder1 should receive refund after settle");
    });

    it("wrong collection asset is rejected at create_auction", async () => {
      // Create two separate collections; try to use asset from one with the other's collection key
      const { asset: a1, collection: c1 } = await mintCoreAsset(
        provider.connection,
        seller
      );
      const { collection: c2 } = await mintCoreAsset(provider.connection, seller);

      const [auctionPk] = auctionPDA(a1, program.programId);
      try {
        await program.methods
          .createAuction(
            new anchor.BN(RESERVE),
            new anchor.BN(TICK),
            ts(-10),
            ts(3600),
            treasury.publicKey
          )
          .accounts({
            seller: seller.publicKey,
            asset: a1,
            collection: c2, // wrong collection
            auction: auctionPk,
            mplCoreProgram: MPL_CORE_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([seller])
          .rpc();
        assert.fail("should have thrown");
      } catch (err) {
        assert.include(err.message, "WrongCollection");
      }
    });
  });
});
