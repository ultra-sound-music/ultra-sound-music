import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { USMAuctionData, UsmBidData, NftData, AuctionState } from './getAuction';

export const USM_AUCTION_PROGRAM_ID = new PublicKey(
  '97snzjXWqi3GhnjxtqFcYhL9q2RyPbAmJmMxLDz8gNC3'
);

// Byte offsets within the Auction account (after 8-byte Anchor discriminator)
const A = {
  seller: 8,
  asset: 40,
  collection: 72,
  treasury: 104,
  reserve: 136,
  tick: 144,
  startTime: 152,
  endTime: 160,
  highestBidder: 168,
  highestBid: 200,
  bidCount: 208,
  state: 216,
  bump: 217,
} as const;

// Byte offsets within a Bid account (after 8-byte Anchor discriminator)
const B = {
  bidder: 8,
  auction: 40,
  amount: 72,
  timestamp: 80,
  bump: 88,
} as const;

const BID_SIZE = 89;

function pk(buf: Buffer, offset: number): PublicKey {
  return new PublicKey(buf.slice(offset, offset + 32));
}

// Lamport amounts are read as a JS number. This is exact for realistic bid sizes (precision
// holds below 2^53 lamports ≈ 9.0M SOL); values above that would lose precision.
function u64(buf: Buffer, offset: number): number {
  return Number(buf.readBigUInt64LE(offset));
}

function i64(buf: Buffer, offset: number): number {
  return Number(buf.readBigInt64LE(offset));
}

// On-chain AuctionState enum: 0 = Active, 1 = Settled, 2 = Cancelled.
// The UI state is derived from the on-chain state plus the clock: an Active auction is
// 'created' before its start_time, 'started' while live, and 'ended' once end_time passes
// (even before settle runs). Settled/Cancelled always map to 'ended'.
function toAuctionState(
  rawState: number,
  startTimeSec: number,
  endTimeSec: number,
  nowSec: number
): AuctionState {
  if (rawState !== 0) return 'ended'; // Settled or Cancelled
  if (nowSec < startTimeSec) return 'created';
  if (nowSec > endTimeSec) return 'ended';
  return 'started';
}

export function getAuctionPDA(assetPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('auction'), assetPubkey.toBytes()],
    USM_AUCTION_PROGRAM_ID
  );
}

export function getBidPDA(auctionPubkey: PublicKey, bidderPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('bid'), auctionPubkey.toBytes(), bidderPubkey.toBytes()],
    USM_AUCTION_PROGRAM_ID
  );
}

async function fetchCoreNftData(connection: Connection, assetPubkey: PublicKey): Promise<NftData> {
  try {
    const info = await connection.getAccountInfo(assetPubkey);
    if (info) {
      const buf = info.data as Buffer;
      // Core BaseAssetV1 layout (mirrors mpl_core::accounts::BaseAssetV1):
      //   key(1) + owner(32) + updateAuthority(1 + 0|32) + name(4+len) + uri(4+len) + ...
      // updateAuthority is an enum: discriminator 0 = None (no payload), 1 = Address and
      // 2 = Collection (each carry a 32-byte pubkey).
      let offset = 1 + 32; // skip key + owner
      const updateAuthorityKind = buf.readUInt8(offset);
      offset += 1; // updateAuthority discriminator
      if (updateAuthorityKind !== 0) {
        offset += 32; // Address/Collection variant carries a pubkey
      }
      const nameLen = buf.readUInt32LE(offset);
      offset += 4 + nameLen; // skip name (we read metadata from the uri below)
      const uriLen = buf.readUInt32LE(offset);
      offset += 4;
      const uri = buf.slice(offset, offset + uriLen).toString('utf8');
      if (uri.startsWith('http')) {
        const meta = await fetch(uri).then((r) => r.json());
        return { pubKey: assetPubkey, metadata: meta };
      }
    }
  } catch {
    // fall through to stub
  }
  return { pubKey: assetPubkey, metadata: { name: '', image: '' } };
}

export async function getProgramAuction(
  connection: Connection,
  auctionPubkey: PublicKey
): Promise<USMAuctionData | undefined> {
  const info = await connection.getAccountInfo(auctionPubkey);
  if (!info) return undefined;

  const buf = info.data as Buffer;

  const assetPubkey = pk(buf, A.asset);
  const startTimeSec = i64(buf, A.startTime);
  const endTimeSec = i64(buf, A.endTime);
  const endTimestampMs = endTimeSec * 1000;
  const reserve = u64(buf, A.reserve);
  const tick = u64(buf, A.tick);
  const rawState = buf[A.state];
  const highestBidder = pk(buf, A.highestBidder);
  const highestBidderStr = highestBidder.toBase58();
  const highestBid = u64(buf, A.highestBid);
  const nowSec = Math.floor(Date.now() / 1000);
  const state = toAuctionState(rawState, startTimeSec, endTimeSec, nowSec);
  const isSettled = rawState === 1;

  const bidAccounts = await connection.getProgramAccounts(USM_AUCTION_PROGRAM_ID, {
    filters: [
      { dataSize: BID_SIZE },
      { memcmp: { offset: B.auction, bytes: auctionPubkey.toBase58() } },
    ],
  });

  const bids: UsmBidData[] = bidAccounts.map(({ account }) => {
    const b = account.data as Buffer;
    const bidder = pk(b, B.bidder).toBase58();
    const amount = u64(b, B.amount);
    return {
      bidder,
      bid: amount / LAMPORTS_PER_SOL,
      timestamp: i64(b, B.timestamp) * 1000,
      won: isSettled ? bidder === highestBidderStr : undefined,
    } as UsmBidData;
  });

  // settle closes the winning bid's PDA (returning its rent to the winner), so the scan above
  // can't return it. Reconstruct the winner from the auction's own highest_bidder/highest_bid
  // so the winner is never dropped and bids[0] stays the winner after sorting.
  const winnerInScan = bids.some((bid) => bid.bidder === highestBidderStr);
  if (highestBid > 0 && !highestBidder.equals(PublicKey.default) && !winnerInScan) {
    bids.push({
      bidder: highestBidderStr,
      bid: highestBid / LAMPORTS_PER_SOL,
      // The winning Bid PDA (and its timestamp) is gone after settle; use the auction end as a
      // best-effort timestamp for display ordering.
      timestamp: endTimestampMs,
      won: isSettled ? true : undefined,
      // settle atomically transfers the NFT to the winner, so once the winning bid is closed
      // there is nothing left for the winner to "redeem".
      hasBeenRedeemed: isSettled ? true : undefined,
    } as UsmBidData);
  }

  bids.sort((x, y) => y.bid - x.bid);

  const auctionNft = await fetchCoreNftData(connection, assetPubkey);

  return {
    pubkey: auctionPubkey,
    auctionNft,
    acceptedToken: SystemProgram.programId,
    endTimestamp: endTimestampMs,
    tickSize: tick / LAMPORTS_PER_SOL,
    floor: reserve / LAMPORTS_PER_SOL,
    state,
    bids,
  };
}
