import dayJs from 'dayjs';

import styles from './BidBoxStatus.scss';

export interface IBidBoxStatusProps {
  endsAt?: number;
  endedAt?: number;
  status?: string;
}

export function BidBoxStatus({ endsAt, endedAt, status }: IBidBoxStatusProps) {
  const endedAtFormatted = dayJs(endedAt).toString();

  // @TODO - use status to determine if "auction ended at" or if "auction ends"
  const message = `Auction ends ${endedAtFormatted}`;
  return <div className={styles.BidBoxStatus}>{message}</div>;
}
