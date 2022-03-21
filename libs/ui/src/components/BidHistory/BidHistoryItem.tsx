import cn from 'clsx';
import { RiFileCopyLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { USMBidData } from '@usm/auction';

import config from '@usm/config';
import { useShowNotification } from '@usm/app-state';

import Link from '../Link/Link';
import SolanaIcon from '../Icons/SolanaIcon/SolanaIcon';

import styles from './BidHistoryItem.scss';

export interface IBidHistoryItem {
  bidder: string;
  bid: number;
  timestamp: number;
}

export function getTimeSinceBid(timestamp: EpochTimeStamp) {
  dayjs.extend(relativeTime);
  return dayjs(timestamp).fromNow();
}

export function BidHistoryItem({ bidder, bid, timestamp }: IBidHistoryItem) {
  function onCopyClick() {
    navigator.clipboard.writeText(bidder || '');
    showNotification({
      type: 'success',
      message: 'Address copied to clipboard',
      timeout: 2000
    });
  }

  const showNotification = useShowNotification();

  if (!bid) {
    const classnames = cn(styles.bidHistoryItem, styles.placeholder);
    return (
      <div className={classnames}>
        <div>&nbsp;</div>
      </div>
    );
  }

  const timeSinceBid = getTimeSinceBid(timestamp);

  return (
    <div className={styles.bidHistoryItem}>
      <SolanaIcon size='tiny' />
      <div className={styles.bidAmount}>
        <div>{bid} SOL</div>
      </div>
      {timeSinceBid && <div className={styles.bidTime}>{timeSinceBid}</div>}
      <div className={styles.bidWalletAddress}>
        <Link
          to={`https://explorer.solana.com/address/${bidder}?cluster=${config.solanaCluster}`}
        >
          {bidder}
        </Link>
      </div>
      <div onClick={onCopyClick} className={styles.copy}>
        <RiFileCopyLine />
      </div>
    </div>
  );
}

export default BidHistoryItem;
