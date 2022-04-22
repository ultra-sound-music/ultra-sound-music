import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { AuctionState, UsmBidData } from '@usm/sol-client';
import styles from './BidBoxStatus.scss';

export interface IBidBoxStatusProps {
  endTimestamp?: number;
  state?: AuctionState;
  currentAddress?: string;
  bids?: UsmBidData[];
}

export function getPendingStatusMessage() {
  return <strong>Coming Soon!</strong>;
}

export function getLiveStatusMessage(endTimestamp?: number) {
  if (!endTimestamp) {
    return '';
  }

  const today = dayjs();
  const endDate = dayjs(endTimestamp);
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
  currentAddress?: string,
  bids?: UsmBidData[]
) {
  const myBid = bids?.find(({ bidder }) => bidder === currentAddress);
  const iWon = bids?.[0].bidder === currentAddress;
  const iLost = !!myBid && !iWon;

  if (iWon && !myBid?.hasBeenRedeemed) {
    return <strong>You won! Click the button to redeem your NFT</strong>;
  } else if (iLost && !myBid.hasBeenRefunded) {
    return <strong>Get refund and claim participation NFT</strong>;
  } else if (iLost && !myBid.hasRedeemedParticipationToken) {
    return <strong>Redeem your participation NFT!</strong>;
  } else {
    const today = dayjs();
    const endDate = dayjs(auctionEnd);

    const formatString = today.isSame(endDate, 'year') ? 'MMM D, h:m A' : 'MMM D, YYYY h:m A';
    return <strong>Auction ended {endDate.format(formatString)}</strong>;
  }
}

export function BidBoxStatus({ endTimestamp, state, currentAddress, bids }: IBidBoxStatusProps) {
  dayjs.extend(duration);

  let statusMessage;
  if (state === 'created') {
    statusMessage = getPendingStatusMessage();
  } else if (state === 'started') {
    statusMessage = getLiveStatusMessage(endTimestamp);
  } else if (state === 'ended') {
    statusMessage = getEndedStatusMessage(endTimestamp, currentAddress, bids);
  }

  return <div className={styles.BidBoxStatus}>{statusMessage}</div>;
}

export default BidBoxStatus;
