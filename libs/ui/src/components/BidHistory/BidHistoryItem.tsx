import cn from 'clsx';
import { RiFileCopyLine, RiArrowRightLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useShowNotification } from '@usm/app-state';
import { getAccountUrl } from '@usm/sol-client';

import Link from '../Link/Link';
import SolanaIcon from '../Icons/SolanaIcon/SolanaIcon';

import styles from './BidHistoryItem.scss';

export interface IBidHistoryItem {
  isCurrentWallet: boolean;
  bidder: string;
  bid: number;
  timestamp: number;
}

export function getTimeSinceBid(timestamp: EpochTimeStamp) {
  dayjs.extend(relativeTime);
  return dayjs(timestamp).fromNow();
}

export function BidHistoryItem({ isCurrentWallet, bidder, bid, timestamp }: IBidHistoryItem) {
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
      {isCurrentWallet && <RiArrowRightLine className={styles.currentMarker} />}
      <SolanaIcon size='tiny' />
      <div className={styles.bidAmount}>
        <div>{bid} SOL</div>
      </div>
      {timeSinceBid && <div className={styles.bidTime}>{timeSinceBid}</div>}
      <div className={styles.bidWalletAddress}>
        <Link to={getAccountUrl(bidder)}>{bidder}</Link>
      </div>
      <div onClick={onCopyClick} className={styles.copy}>
        <RiFileCopyLine />
      </div>
    </div>
  );
}

export default BidHistoryItem;
