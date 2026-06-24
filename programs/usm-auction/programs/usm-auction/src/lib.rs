use anchor_lang::prelude::*;

pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use state::*;

declare_id!("97snzjXWqi3GhnjxtqFcYhL9q2RyPbAmJmMxLDz8gNC3");

#[program]
pub mod usm_auction {
    use super::*;

    pub fn create_auction(
        ctx: Context<CreateAuction>,
        reserve: u64,
        tick: u64,
        start_time: i64,
        end_time: i64,
        treasury: Pubkey,
    ) -> Result<()> {
        instructions::create_auction::handler(ctx, reserve, tick, start_time, end_time, treasury)
    }

    pub fn place_bid(ctx: Context<PlaceBid>, amount: u64) -> Result<()> {
        instructions::place_bid::handler(ctx, amount)
    }

    pub fn cancel_auction(ctx: Context<CancelAuction>) -> Result<()> {
        instructions::cancel_auction::handler(ctx)
    }

    pub fn claim_refund(ctx: Context<ClaimRefund>) -> Result<()> {
        instructions::claim_refund::handler(ctx)
    }

    pub fn settle(ctx: Context<Settle>) -> Result<()> {
        instructions::settle::handler(ctx)
    }
}

#[derive(Accounts)]
pub struct CreateAuction<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    /// CHECK: validated via mpl_core CPI (asset owner == seller, collection match)
    #[account(mut)]
    pub asset: UncheckedAccount<'info>,

    /// CHECK: validated by collection field check
    pub collection: UncheckedAccount<'info>,

    #[account(
        init,
        payer = seller,
        space = Auction::LEN,
        seeds = [b"auction", asset.key().as_ref()],
        bump,
    )]
    pub auction: Account<'info, Auction>,

    /// CHECK: Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,

    #[account(
        mut,
        seeds = [b"auction", auction.asset.as_ref()],
        bump = auction.bump,
    )]
    pub auction: Account<'info, Auction>,

    #[account(
        init_if_needed,
        payer = bidder,
        space = Bid::LEN,
        seeds = [b"bid", auction.key().as_ref(), bidder.key().as_ref()],
        bump,
    )]
    pub bid: Account<'info, Bid>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelAuction<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        mut,
        seeds = [b"auction", auction.asset.as_ref()],
        bump = auction.bump,
        close = seller,
    )]
    pub auction: Account<'info, Auction>,

    /// CHECK: validated by auction.asset
    #[account(mut, constraint = asset.key() == auction.asset)]
    pub asset: UncheckedAccount<'info>,

    /// CHECK: validated by auction.collection
    #[account(constraint = collection.key() == auction.collection)]
    pub collection: UncheckedAccount<'info>,

    /// CHECK: Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRefund<'info> {
    /// CHECK: anyone can call claim_refund on behalf of a bidder; lamports go to bidder
    #[account(mut)]
    pub bidder: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"auction", auction.asset.as_ref()],
        bump = auction.bump,
    )]
    pub auction: Account<'info, Auction>,

    #[account(
        mut,
        close = bidder,
        seeds = [b"bid", auction.key().as_ref(), bidder.key().as_ref()],
        bump = bid.bump,
        constraint = bid.bidder == bidder.key(),
    )]
    pub bid: Account<'info, Bid>,
}

#[derive(Accounts)]
pub struct Settle<'info> {
    /// CHECK: permissionless — anyone may call settle
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"auction", auction.asset.as_ref()],
        bump = auction.bump,
    )]
    pub auction: Account<'info, Auction>,

    /// CHECK: auction.seller — validated in handler
    #[account(mut, constraint = seller.key() == auction.seller)]
    pub seller: UncheckedAccount<'info>,

    /// CHECK: highest bidder — ignored when bid_count == 0; validated in handler when bid_count > 0
    #[account(mut)]
    pub winner: UncheckedAccount<'info>,

    /// CHECK: winner's bid PDA — ignored when bid_count == 0; validated and drained in handler
    #[account(mut)]
    pub winner_bid: UncheckedAccount<'info>,

    /// CHECK: auction.treasury — receives winning bid SOL
    #[account(mut, constraint = treasury.key() == auction.treasury)]
    pub treasury: UncheckedAccount<'info>,

    /// CHECK: validated by auction.asset
    #[account(mut, constraint = asset.key() == auction.asset)]
    pub asset: UncheckedAccount<'info>,

    /// CHECK: validated by auction.collection
    #[account(constraint = collection.key() == auction.collection)]
    pub collection: UncheckedAccount<'info>,

    /// CHECK: Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}
