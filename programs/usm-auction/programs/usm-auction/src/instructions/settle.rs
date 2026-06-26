use anchor_lang::prelude::*;
use mpl_core::instructions::TransferV1CpiBuilder;
use crate::{errors::AuctionError, events::AuctionSettled, state::*, Settle};

pub fn handler(ctx: Context<Settle>) -> Result<()> {
    let clock = Clock::get()?;
    let auction = &ctx.accounts.auction;

    require!(
        clock.unix_timestamp > auction.end_time,
        AuctionError::AuctionNotEnded
    );
    require!(
        auction.state == AuctionState::Active,
        AuctionError::AuctionAlreadyFinalised
    );

    // NOTE: settle intentionally does NOT close the auction account. The record must
    // outlive settle so losing bidders can still call claim_refund and the UI can show
    // the final result. The auction-PDA rent is the deliberate cost of that record.
    let asset_key = ctx.accounts.asset.key();
    let auction_bump = ctx.accounts.auction.bump;
    let signer_seeds: &[&[&[u8]]] = &[&[b"auction", asset_key.as_ref(), &[auction_bump]]];

    // Transfer Core asset to winner.
    TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
        .asset(&ctx.accounts.asset)
        .collection(Some(&ctx.accounts.collection))
        .payer(&ctx.accounts.payer.to_account_info())
        .authority(Some(&ctx.accounts.auction.to_account_info()))
        .new_owner(&ctx.accounts.winner.to_account_info())
        .system_program(Some(&ctx.accounts.system_program))
        .invoke_signed(signer_seeds)?;

    // Transfer the winning bid amount to treasury. The `close = winner` constraint on
    // winner_bid fires after this handler and transfers the remaining rent back to the
    // winner, matching the loser refund path (claim_refund uses `close = bidder`).
    let winning_amount = ctx.accounts.winner_bid.amount;
    let total_lamports = ctx.accounts.winner_bid.to_account_info().lamports();
    let rent_refund = total_lamports
        .checked_sub(winning_amount)
        .ok_or(AuctionError::MathOverflow)?;

    **ctx.accounts.treasury.try_borrow_mut_lamports()? = ctx
        .accounts
        .treasury
        .lamports()
        .checked_add(winning_amount)
        .ok_or(AuctionError::MathOverflow)?;

    // Reduce winner_bid to just the rent; `close = winner` drains this to winner after
    // the handler returns (also writes the closed-account discriminator, preventing reuse).
    **ctx.accounts.winner_bid.to_account_info().try_borrow_mut_lamports()? = rent_refund;

    ctx.accounts.auction.state = AuctionState::Settled;

    emit!(AuctionSettled {
        auction: ctx.accounts.auction.key(),
        winner: ctx.accounts.winner.key(),
        amount: winning_amount,
    });

    Ok(())
}
