use anchor_lang::prelude::*;

#[error_code]
pub enum AuctionError {
    #[msg("Auction has not started yet")]
    AuctionNotStarted,
    #[msg("Auction has already ended")]
    AuctionEnded,
    #[msg("Auction is not active")]
    AuctionNotActive,
    #[msg("Auction has not ended yet")]
    AuctionNotEnded,
    #[msg("Auction already settled or cancelled")]
    AuctionAlreadyFinalised,
    #[msg("Bid is below the reserve price")]
    BidBelowReserve,
    #[msg("Bid does not meet the minimum increment")]
    BidBelowTick,
    #[msg("Cannot cancel: auction has bids")]
    CancelWithBids,
    #[msg("Only the seller can perform this action")]
    UnauthorisedSeller,
    #[msg("Refund not available: bidder is still the highest bidder")]
    RefundDenied,
    #[msg("Asset does not belong to the expected collection")]
    WrongCollection,
    #[msg("Arithmetic overflow")]
    MathOverflow,
    #[msg("Bid decrease not allowed; new amount must exceed existing bid")]
    BidTooLow,
    #[msg("Invalid end time: must be after start time")]
    InvalidEndTime,
    #[msg("Invalid start time: must not be in the past")]
    InvalidStartTime,
}
