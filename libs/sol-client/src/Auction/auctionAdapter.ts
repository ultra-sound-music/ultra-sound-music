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

function u64(buf: Buffer, offset: number): number {
  return Number(buf.readBigUInt64LE(offset));
}

function i64(buf: Buffer, offset: number): number {
  return Number(buf.readBigInt64LE(offset));
}

function toAuctionState(raw: number): AuctionState {
  return raw === 0 ? 'started' : 'ended';
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
      // Core BaseAssetV1: key(1) + updateAuthority(33) + name(4+len) + uri(4+len)
      let offset = 34; // skip key + updateAuthority
      const nameLen = buf.readUInt32LE(offset);
      offset += 4 + nameLen;
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
  const endTimestampMs = i64(buf, A.endTime) * 1000;
  const reserve = u64(buf, A.reserve);
  const tick = u64(buf, A.tick);
  const rawState = buf[A.state];
  const highestBidder = pk(buf, A.highestBidder);
  const isSettled = rawState === 1;

  const bidAccounts = await connection.getProgramAccounts(USM_AUCTION_PROGRAM_ID, {
    filters: [
      { dataSize: BID_SIZE },
      { memcmp: { offset: B.auction, bytes: auctionPubkey.toBase58() } },
    ],
  });

  const bids: UsmBidData[] = bidAccounts
    .map(({ account }) => {
      const b = account.data as Buffer;
      const bidder = pk(b, B.bidder).toBase58();
      const amount = u64(b, B.amount);
      return {
        bidder,
        bid: amount / LAMPORTS_PER_SOL,
        timestamp: i64(b, B.timestamp) * 1000,
        won: isSettled ? bidder === highestBidder.toBase58() : undefined,
      } as UsmBidData;
    })
    .sort((x, y) => y.bid - x.bid);

  const auctionNft = await fetchCoreNftData(connection, assetPubkey);

  return {
    pubkey: auctionPubkey,
    auctionNft,
    acceptedToken: SystemProgram.programId,
    endTimestamp: endTimestampMs,
    tickSize: tick / LAMPORTS_PER_SOL,
    floor: reserve / LAMPORTS_PER_SOL,
    state: toAuctionState(rawState),
    bids,
  };
}
