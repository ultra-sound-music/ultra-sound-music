use anchor_lang::prelude::*;
use mpl_core::{
    accounts::BaseAssetV1,
    instructions::TransferV1CpiBuilder,
};
use crate::{errors::AuctionError, events::AuctionCreated, state::*, CreateAuction};

pub fn handler(
    ctx: Context<CreateAuction>,
    reserve: u64,
    tick: u64,
    start_time: i64,
    end_time: i64,
    treasury: Pubkey,
) -> Result<()> {
    let clock = Clock::get()?;

    require!(reserve > 0, AuctionError::BidBelowReserve);
    require!(tick > 0, AuctionError::BidBelowTick);
    require!(end_time > start_time, AuctionError::InvalidEndTime);
    // Allow start_time slightly in the past (clock skew tolerance: 60s)
    require!(
        start_time >= clock.unix_timestamp - 60,
        AuctionError::InvalidStartTime
    );

    // Validate Core asset belongs to the expected collection
    let asset_data = ctx.accounts.asset.try_borrow_data()?;
    let asset = BaseAssetV1::from_bytes(&asset_data)
        .map_err(|_| error!(AuctionError::WrongCollection))?;
    require!(
        asset.update_authority
            == mpl_core::types::UpdateAuthority::Collection(ctx.accounts.collection.key()),
        AuctionError::WrongCollection
    );
    drop(asset_data);

    // CPI: transfer Core asset from seller → auction PDA
    TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
        .asset(&ctx.accounts.asset)
        .collection(Some(&ctx.accounts.collection))
        .payer(&ctx.accounts.seller.to_account_info())
        .authority(Some(&ctx.accounts.seller.to_account_info()))
        .new_owner(&ctx.accounts.auction.to_account_info())
        .system_program(Some(&ctx.accounts.system_program))
        .invoke()?;

    let auction_bump = ctx.bumps.auction;
    let auction = &mut ctx.accounts.auction;
    auction.seller = ctx.accounts.seller.key();
    auction.asset = ctx.accounts.asset.key();
    auction.collection = ctx.accounts.collection.key();
    auction.treasury = treasury;
    auction.reserve = reserve;
    auction.tick = tick;
    auction.start_time = start_time;
    auction.end_time = end_time;
    auction.highest_bidder = Pubkey::default();
    auction.highest_bid = 0;
    auction.bid_count = 0;
    auction.state = AuctionState::Active;
    auction.bump = auction_bump;

    emit!(AuctionCreated {
        auction: auction.key(),
        seller: auction.seller,
        asset: auction.asset,
        reserve,
        tick,
        start_time,
        end_time,
    });

    Ok(())
}
