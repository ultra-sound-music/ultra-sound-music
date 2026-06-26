use anchor_lang::prelude::*;
use mpl_core::instructions::TransferV1CpiBuilder;
use crate::{errors::AuctionError, events::AuctionCancelled, state::*, SettleNoBids};

pub fn handler(ctx: Context<SettleNoBids>) -> Result<()> {
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
    require!(auction.bid_count == 0, AuctionError::CancelWithBids);

    let asset_key = ctx.accounts.asset.key();
    let auction_bump = ctx.accounts.auction.bump;
    let signer_seeds: &[&[&[u8]]] = &[&[b"auction", asset_key.as_ref(), &[auction_bump]]];

    // No bids: return asset to seller and mark auction as cancelled.
    TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
        .asset(&ctx.accounts.asset)
        .collection(Some(&ctx.accounts.collection))
        .payer(&ctx.accounts.payer.to_account_info())
        .authority(Some(&ctx.accounts.auction.to_account_info()))
        .new_owner(&ctx.accounts.seller.to_account_info())
        .system_program(Some(&ctx.accounts.system_program))
        .invoke_signed(signer_seeds)?;

    ctx.accounts.auction.state = AuctionState::Cancelled;

    emit!(AuctionCancelled {
        auction: ctx.accounts.auction.key(),
    });

    Ok(())
}
