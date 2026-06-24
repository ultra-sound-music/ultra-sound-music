use anchor_lang::prelude::*;
use mpl_core::instructions::TransferV1CpiBuilder;
use crate::{errors::AuctionError, events::AuctionCancelled, state::*, CancelAuction};

pub fn handler(ctx: Context<CancelAuction>) -> Result<()> {
    let auction = &ctx.accounts.auction;

    require!(auction.seller == ctx.accounts.seller.key(), AuctionError::UnauthorisedSeller);
    require!(auction.bid_count == 0, AuctionError::CancelWithBids);
    require!(
        auction.state == AuctionState::Active,
        AuctionError::AuctionAlreadyFinalised
    );

    // CPI: transfer Core asset from auction PDA → seller
    let asset_key = ctx.accounts.asset.key();
    let auction_bump = ctx.accounts.auction.bump;
    let signer_seeds: &[&[&[u8]]] = &[&[b"auction", asset_key.as_ref(), &[auction_bump]]];

    TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
        .asset(&ctx.accounts.asset)
        .collection(Some(&ctx.accounts.collection))
        .authority(Some(&ctx.accounts.auction.to_account_info()))
        .new_owner(&ctx.accounts.seller.to_account_info())
        .system_program(Some(&ctx.accounts.system_program))
        .invoke_signed(signer_seeds)?;

    emit!(AuctionCancelled {
        auction: ctx.accounts.auction.key(),
    });

    // `close = seller` returns auction rent to seller
    Ok(())
}
