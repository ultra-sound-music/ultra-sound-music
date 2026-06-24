use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AuctionState {
    Active,
    Settled,
    Cancelled,
}

#[account]
pub struct Auction {
    pub seller: Pubkey,          // 32
    pub asset: Pubkey,           // 32 — Core asset pubkey
    pub collection: Pubkey,      // 32 — Core collection pubkey (used for gating)
    pub treasury: Pubkey,        // 32 — receives seller proceeds on settle
    pub reserve: u64,            // 8  — minimum first bid (lamports)
    pub tick: u64,               // 8  — minimum increment above current high bid (lamports)
    pub start_time: i64,         // 8  — unix timestamp; bids rejected before this
    pub end_time: i64,           // 8  — unix timestamp; bids rejected after this
    pub highest_bidder: Pubkey,  // 32
    pub highest_bid: u64,        // 8
    pub bid_count: u64,          // 8  — unique bidders
    pub state: AuctionState,     // 1
    pub bump: u8,                // 1
}

impl Auction {
    // 8 discriminator + sum of field sizes
    pub const LEN: usize = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 32 + 8 + 8 + 1 + 1;
    // = 208 bytes
}

#[account]
pub struct Bid {
    pub bidder: Pubkey,    // 32
    pub auction: Pubkey,   // 32
    pub amount: u64,       // 8  — current bid amount in lamports (mirrors lamports above rent)
    pub timestamp: i64,    // 8  — last-updated unix timestamp
    pub bump: u8,          // 1
}

impl Bid {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 1;
    // = 89 bytes
}
