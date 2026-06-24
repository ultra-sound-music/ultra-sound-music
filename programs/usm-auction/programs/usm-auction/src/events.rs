use anchor_lang::prelude::*;

#[event]
pub struct AuctionCreated {
    pub auction: Pubkey,
    pub seller: Pubkey,
    pub asset: Pubkey,
    pub reserve: u64,
    pub tick: u64,
    pub start_time: i64,
    pub end_time: i64,
}

#[event]
pub struct BidPlaced {
    pub auction: Pubkey,
    pub bidder: Pubkey,
    pub amount: u64,
    pub new_end_time: i64,
}

#[event]
pub struct AuctionSettled {
    pub auction: Pubkey,
    pub winner: Pubkey,
    pub amount: u64,
}

#[event]
pub struct AuctionCancelled {
    pub auction: Pubkey,
}

#[event]
pub struct RefundClaimed {
    pub auction: Pubkey,
    pub bidder: Pubkey,
    pub amount: u64,
}
