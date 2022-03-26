import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { AuctionState } from '@usm/auction';
import styles from './BidBoxStatus.scss';

export interface IBidBoxStatusBids {
  bidder: string;
  bid: number;
  timestamp: number;
}

export interface IBidBoxStatusProps {
  auctionEnd?: number;
  state?: AuctionState;
  currentWallet?: string;
  winningWallet?: string;
  bids?: IBidBoxStatusBids[];
}

export function getPendingStatusMessage() {
  return <strong>Coming Soon!</strong>;
}

export function getLiveStatusMessage(auctionEnd?: number) {
  if (!auctionEnd) {
    return '';
  }

  const today = dayjs();
  const endDate = dayjs(auctionEnd);
  const dateDiff = dayjs.duration(endDate.diff(today));

  const days = dateDiff.days();
  const hrs = dateDiff.hours();
  const hours = days ? days * hrs : hrs;

  return (
    <>
      <strong>Auction ends in</strong>&nbsp;&nbsp;&nbsp;&nbsp;
      <strong>{hours}</strong> hours <strong>{dateDiff.minutes()}</strong> minutes{' '}
      <strong>{dateDiff.seconds()}</strong> seconds
    </>
  );
}

export function getEndedStatusMessage(
  auctionEnd?: number,
  currentWallet?: string,
  winningWallet?: string,
  bids?: IBidBoxStatusBids[]
) {
  const endDate = dayjs(auctionEnd);
  const isWinningWallet = currentWallet === winningWallet;
  const hasClaimedBid = false;
  const isBiddingWallet = false;

  if (isWinningWallet && !hasClaimedBid) {
    return <strong>Congratulations, you won!</strong>;
  } else if (isBiddingWallet) {
    return <strong>You didn't win. Click to claim your bid.</strong>;
  }

  return <strong>Auction ended {endDate.format('MMM M, YYYY h:m A')}</strong>;
}

export function BidBoxStatus({
  auctionEnd,
  state,
  currentWallet,
  winningWallet,
  bids
}: IBidBoxStatusProps) {
  dayjs.extend(duration);

  let statusMessage;
  if (state === AuctionState.Created) {
    statusMessage = getPendingStatusMessage();
  } else if (state === AuctionState.Started) {
    statusMessage = getLiveStatusMessage(auctionEnd);
  } else if (state === AuctionState.Ended) {
    statusMessage = getEndedStatusMessage(auctionEnd, currentWallet, winningWallet, bids);
  }

  return <div className={styles.BidBoxStatus}>{statusMessage}</div>;
}

export default BidBoxStatus;
