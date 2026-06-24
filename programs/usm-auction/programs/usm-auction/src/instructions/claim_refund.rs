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

    emit!(RefundClaimed {
        auction: auction.key(),
        bidder: bid.bidder,
        amount,
    });

    // `close = bidder` returns all lamports (rent + bid amount) to bidder
    Ok(())
}
