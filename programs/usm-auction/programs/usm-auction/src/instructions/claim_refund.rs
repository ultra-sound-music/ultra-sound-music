use anchor_lang::prelude::*;
use crate::{errors::AuctionError, events::RefundClaimed, state::*, ClaimRefund};

pub fn handler(ctx: Context<ClaimRefund>) -> Result<()> {
    let auction = &ctx.accounts.auction;
    let bid = &ctx.accounts.bid;

    // Refund allowed if: bidder is not the current highest bidder, OR auction is no longer active
    let is_highest = auction.highest_bidder == bid.bidder
        && auction.state == AuctionState::Active;
    require!(!is_highest, AuctionError::RefundDenied);

    let amount = bid.amount;
    let bidder = bid.bidder;
    let auction_key = auction.key();

    emit!(RefundClaimed {
        auction: auction_key,
        bidder,
        amount,
    });

    // This bid's PDA is being closed (`close = bidder` returns rent + bid amount to bidder),
    // so it's no longer an active bid. Decrement bid_count so it stays a count of currently
    // active bids: this keeps cancel gating (bid_count == 0) and settle's no-bid path
    // selection accurate, and prevents a refund-then-rebid from being double-counted.
    let auction = &mut ctx.accounts.auction;
    auction.bid_count = auction.bid_count.saturating_sub(1);

    Ok(())
}
