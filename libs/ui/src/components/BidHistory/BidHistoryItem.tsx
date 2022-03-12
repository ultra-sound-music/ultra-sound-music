import cn from 'clsx';
import { RiFileCopyLine } from 'react-icons/ri';

import Link from '../Link/Link';
import SolanaIcon from '../Icons/SolanaIcon/SolanaIcon';

import styles from './BidHistoryItem.scss';

export interface IBidHistoryItem {
  bidderWalletAddress?: string;
  bid?: number;
  timeSinceBid?: {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
  };
}

export function BidHistoryItem({
  bidderWalletAddress,
  bid,
  timeSinceBid
}: IBidHistoryItem) {
  function onCopyClick() {
    navigator.clipboard.writeText(bidderWalletAddress || '');
  }

  if (!bid) {
    const classnames = cn(styles.bidHistoryItem, styles.placeholder);
    return (
      <div className={classnames}>
        <div>&nbsp;</div>
      </div>
    );
  }

  return (
    <div className={styles.bidHistoryItem}>
      <SolanaIcon size='tiny' />
      <div className={styles.bidAmount}>
        <div>{bid} SOL</div>
      </div>
      {timeSinceBid && (
        <div className={styles.bidTime}>
          {!!timeSinceBid.days && timeSinceBid.days > 0 && (
            <div>{timeSinceBid.days} days ago</div>
          )}
          {!timeSinceBid.days &&
            !!timeSinceBid.hours &&
            timeSinceBid.hours > 0 && <div>{timeSinceBid.hours} hours ago</div>}
          {!timeSinceBid.days &&
            !timeSinceBid.hours &&
            !!timeSinceBid.minutes &&
            timeSinceBid.minutes > 0 && (
              <div>{timeSinceBid.minutes} minutes ago</div>
            )}
          {!timeSinceBid.days &&
            !timeSinceBid.hours &&
            !timeSinceBid.minutes &&
            !!timeSinceBid.seconds &&
            timeSinceBid.seconds > 0 && (
              <div>{Math.floor(timeSinceBid.seconds)} seconds ago</div>
            )}
        </div>
      )}
      <div className={styles.bidWalletAddress}>
        <Link
          to={`https://explorer.solana.com/address/${bidderWalletAddress}?cluster='devnet'`}
        >
          {bidderWalletAddress}
        </Link>
      </div>
      <div onClick={onCopyClick} className={styles.copy}>
        <RiFileCopyLine />
      </div>
    </div>
  );
}

export default BidHistoryItem;
