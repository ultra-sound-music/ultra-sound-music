import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import styles from './BidBoxStatus.scss';

export interface IBidBoxStatusBids {
  bidder: string;
  bid: number;
  timestamp: number;
}

export interface IBidBoxStatusProps {
  endedAt?: number;
  isLive?: boolean;
  currentWallet?: string;
  winningWallet?: string;
  bids?: IBidBoxStatusBids[];
}

export function getLiveStatusMessage(endedAt?: number) {
  if (!endedAt) {
    return '';
  }

  const today = dayjs();
  const endDate = dayjs(endedAt);
  const dateDiff = dayjs.duration(endDate.diff(today));

  const days = dateDiff.days();
  const hrs = dateDiff.hours();
  const hours = days ? days * hrs : hrs;

  return (
    <>
      <strong>Auction ends in</strong>&nbsp;&nbsp;&nbsp;&nbsp;
      <strong>{hours}</strong> hours <strong>{dateDiff.minutes()}</strong>{' '}
      minutes <strong>{dateDiff.seconds()}</strong> seconds
    </>
  );
}

export function getEndedStatusMessage(
  endedAt?: number,
  currentWallet?: string,
  winningWallet?: string,
  bids?: IBidBoxStatusBids[]
) {
  const endDate = dayjs(endedAt);
  const isWinningWallet = currentWallet === winningWallet;
  const hasClaimedBid = false;
  const isBiddingWallet = false;

  if (isWinningWallet && !hasClaimedBid) {
    return <strong>Congratulations, you won!</strong>;
  } else if (isBiddingWallet) {
    return <strong>You didn't win. Click refund to claim your bid.</strong>;
  } 

  return <strong>Auction ended {endDate.format('MMM M, YYYY h:m A')}</strong>;
}

export function BidBoxStatus({
  endedAt,
  isLive,
  currentWallet,
  winningWallet,
  bids
}: IBidBoxStatusProps) {
  dayjs.extend(duration);

  const statusMessage = isLive
    ? getLiveStatusMessage(endedAt)
    : getEndedStatusMessage(endedAt, currentWallet, winningWallet, bids);

  return <div className={styles.BidBoxStatus}>{statusMessage}</div>;
}

export default BidBoxStatus;
