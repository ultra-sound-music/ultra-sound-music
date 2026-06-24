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

    // NOTE: settle intentionally does NOT close the auction account on either path. The
    // record must outlive settle so losing bidders can still call claim_refund (which
    // requires this account) and the UI can show the final result. The auction-PDA rent
    // is the deliberate, one-time cost of keeping that permanent record. (cancel_auction
    // closes instead, because a pre-end no-bid cancel leaves nothing to refund or display.)
    if auction.bid_count == 0 {
        // No bids: return asset to seller, mark cancelled.
        // winner and winner_bid accounts are ignored in this path.
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
    } else {
        // Validate winner is the highest bidder.
        require!(
            ctx.accounts.winner.key() == auction.highest_bidder,
            AuctionError::RefundDenied
        );

        // Derive and validate the winner's bid PDA.
        let auction_key = ctx.accounts.auction.key();
        let winner_key = ctx.accounts.winner.key();
        let (expected_bid_pda, _) = Pubkey::find_program_address(
            &[b"bid", auction_key.as_ref(), winner_key.as_ref()],
            ctx.program_id,
        );
        require!(
            ctx.accounts.winner_bid.key() == expected_bid_pda,
            AuctionError::RefundDenied
        );
        require!(
            ctx.accounts.winner_bid.to_account_info().owner == ctx.program_id,
            AuctionError::RefundDenied
        );

        // Read the winning bid amount by deserializing the Bid account. This validates the
        // 8-byte discriminator and ties the read to the canonical Bid struct rather than a
        // hardcoded byte offset.
        let winning_amount = {
            let data = ctx.accounts.winner_bid.try_borrow_data()?;
            let bid = Bid::try_deserialize(&mut &data[..])
                .map_err(|_| error!(AuctionError::RefundDenied))?;
            require!(bid.bidder == winner_key, AuctionError::RefundDenied);
            bid.amount
        };

        // Transfer Core asset to winner.
        TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
            .asset(&ctx.accounts.asset)
            .collection(Some(&ctx.accounts.collection))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.auction.to_account_info()))
            .new_owner(&ctx.accounts.winner.to_account_info())
            .system_program(Some(&ctx.accounts.system_program))
            .invoke_signed(signer_seeds)?;

        // Close the winner's bid PDA: the winning bid goes to the treasury, and the rent the
        // winner paid to open the PDA is returned to them (symmetric with the loser refund
        // path, which returns rent + bid via `close = bidder`). Any unexpected surplus also
        // returns to the winner so the account can be zeroed out.
        let total_lamports = ctx.accounts.winner_bid.lamports();
        let rent_refund = total_lamports
            .checked_sub(winning_amount)
            .ok_or(AuctionError::MathOverflow)?;

        **ctx.accounts.treasury.try_borrow_mut_lamports()? = ctx
            .accounts
            .treasury
            .lamports()
            .checked_add(winning_amount)
            .ok_or(AuctionError::MathOverflow)?;
        **ctx.accounts.winner.try_borrow_mut_lamports()? = ctx
            .accounts
            .winner
            .lamports()
            .checked_add(rent_refund)
            .ok_or(AuctionError::MathOverflow)?;
        **ctx.accounts.winner_bid.try_borrow_mut_lamports()? = 0;
        ctx.accounts.winner_bid.try_borrow_mut_data()?.fill(0);

        ctx.accounts.auction.state = AuctionState::Settled;

        emit!(AuctionSettled {
            auction: ctx.accounts.auction.key(),
            winner: ctx.accounts.winner.key(),
            amount: winning_amount,
        });
    }

    Ok(())
}
