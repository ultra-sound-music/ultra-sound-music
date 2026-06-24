use anchor_lang::prelude::*;
use mpl_core::instructions::TransferV1CpiBuilder;
use crate::{errors::AuctionError, events::{AuctionCancelled, AuctionSettled}, state::*, Settle};

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

    let asset_key = ctx.accounts.asset.key();
    let auction_bump = ctx.accounts.auction.bump;
    let signer_seeds: &[&[&[u8]]] = &[&[b"auction", asset_key.as_ref(), &[auction_bump]]];

    if auction.bid_count == 0 {
        // No bids: return asset to seller, mark cancelled
        TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
            .asset(&ctx.accounts.asset)
            .collection(Some(&ctx.accounts.collection))
            .authority(Some(&ctx.accounts.auction.to_account_info()))
            .new_owner(&ctx.accounts.seller.to_account_info())
            .system_program(Some(&ctx.accounts.system_program))
            .invoke_signed(signer_seeds)?;

        ctx.accounts.auction.state = AuctionState::Cancelled;

        emit!(AuctionCancelled {
            auction: ctx.accounts.auction.key(),
        });
    } else {
        // Transfer Core asset to winner
        TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
            .asset(&ctx.accounts.asset)
            .collection(Some(&ctx.accounts.collection))
            .authority(Some(&ctx.accounts.auction.to_account_info()))
            .new_owner(&ctx.accounts.winner.to_account_info())
            .system_program(Some(&ctx.accounts.system_program))
            .invoke_signed(signer_seeds)?;

        // Drain winner's bid PDA lamports → treasury (bid amount + rent)
        let bid_lamports = ctx.accounts.winner_bid.to_account_info().lamports();
        **ctx.accounts.winner_bid.to_account_info().try_borrow_mut_lamports()? = 0;
        **ctx.accounts.treasury.try_borrow_mut_lamports()? = ctx
            .accounts
            .treasury
            .lamports()
            .checked_add(bid_lamports)
            .ok_or(AuctionError::MathOverflow)?;
        ctx.accounts.winner_bid.to_account_info().data.borrow_mut().fill(0);

        let winning_amount = ctx.accounts.winner_bid.amount;
        ctx.accounts.auction.state = AuctionState::Settled;

        emit!(AuctionSettled {
            auction: ctx.accounts.auction.key(),
            winner: ctx.accounts.winner.key(),
            amount: winning_amount,
        });
    }

    Ok(())
}
