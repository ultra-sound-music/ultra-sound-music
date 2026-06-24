use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::{errors::AuctionError, events::BidPlaced, state::*, PlaceBid};

const ANTI_SNIPE_WINDOW: i64 = 600; // 10 minutes in seconds

pub fn handler(ctx: Context<PlaceBid>, amount: u64) -> Result<()> {
    let clock = Clock::get()?;
    let auction = &ctx.accounts.auction;

    require!(auction.state == AuctionState::Active, AuctionError::AuctionNotActive);
    require!(clock.unix_timestamp >= auction.start_time, AuctionError::AuctionNotStarted);
    require!(clock.unix_timestamp <= auction.end_time, AuctionError::AuctionEnded);

    let existing_bid = ctx.accounts.bid.amount;
    let is_new_bidder = existing_bid == 0;
    let is_current_leader =
        !is_new_bidder && ctx.accounts.bidder.key() == auction.highest_bidder;

    if auction.bid_count == 0 {
        // First bid in the auction must meet the reserve.
        require!(amount >= auction.reserve, AuctionError::BidBelowReserve);
    } else if is_current_leader {
        // The current leader topping up their own bid only needs to strictly increase it —
        // they should not have to outbid themselves by a full tick.
        require!(amount > existing_bid, AuctionError::BidTooLow);
    } else {
        // Outbidding someone else must clear the current high bid by at least one tick.
        // (For a returning, previously-outbid bidder this also guarantees amount > existing_bid,
        // since highest_bid > their existing_bid.)
        let min_bid = auction.highest_bid
            .checked_add(auction.tick)
            .ok_or(AuctionError::MathOverflow)?;
        require!(amount >= min_bid, AuctionError::BidBelowTick);
    }

    // Transfer only the increment into the Bid PDA
    let transfer_amount = amount
        .checked_sub(existing_bid)
        .ok_or(AuctionError::MathOverflow)?;

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.bidder.to_account_info(),
                to: ctx.accounts.bid.to_account_info(),
            },
        ),
        transfer_amount,
    )?;

    let bid = &mut ctx.accounts.bid;
    if is_new_bidder {
        bid.bidder = ctx.accounts.bidder.key();
        bid.auction = ctx.accounts.auction.key();
        bid.bump = ctx.bumps.bid;
    }
    bid.amount = amount;
    bid.timestamp = clock.unix_timestamp;

    let auction = &mut ctx.accounts.auction;
    auction.highest_bidder = ctx.accounts.bidder.key();
    auction.highest_bid = amount;
    if is_new_bidder {
        auction.bid_count = auction.bid_count
            .checked_add(1)
            .ok_or(AuctionError::MathOverflow)?;
    }

    // Anti-snipe: extend end_time if bid lands in the final window
    let time_left = auction.end_time.saturating_sub(clock.unix_timestamp);
    if time_left < ANTI_SNIPE_WINDOW {
        auction.end_time = auction.end_time
            .checked_add(ANTI_SNIPE_WINDOW)
            .ok_or(AuctionError::MathOverflow)?;
    }

    emit!(BidPlaced {
        auction: auction.key(),
        bidder: ctx.accounts.bidder.key(),
        amount,
        new_end_time: auction.end_time,
    });

    Ok(())
}
