import BidHistoryItem, { IBidHistoryItem } from './BidHistoryItem';

import styles from './BidHistory.scss';

export { IBidHistoryItem };

export interface IBidHistoryProps {
  bids?: IBidHistoryItem[];
  isProcessing: boolean;
}

export function BidHistory({ bids, isProcessing }: IBidHistoryProps) {
  bids = isProcessing
    ? ([
        { timestamp: 1 },
        { timestamp: 2 },
        { timestamp: 3 }
      ] as unknown as IBidHistoryItem[])
    : bids;

  return (
    <div className={styles.BidHistory}>
      <p>Bid history</p>
      <div className={styles.bidHistoryList}>
        {bids?.slice(0, 3).map((bid) => (
          <BidHistoryItem key={bid.timestamp} {...bid} />
        ))}
      </div>
    </div>
  );
}

export default BidHistory;
