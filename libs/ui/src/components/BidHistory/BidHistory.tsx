import BidHistoryItem, { IBidHistoryItem } from './BidHistoryItem';

import styles from './BidHistory.scss';
import { USMBidData } from '@usm/auction';

export { IBidHistoryItem };

export interface IBidHistoryProps {
  bids?: USMBidData[];
  currentAddress?: string;
  isProcessing: boolean;
}

export function BidHistory({ bids, currentAddress, isProcessing }: IBidHistoryProps) {
  if (isProcessing) {
    bids = [{ timestamp: 1 }, { timestamp: 2 }, { timestamp: 3 }] as unknown as IBidHistoryItem[];
  } else if (!bids?.length) {
    return null;
  }

  return (
    <div className={styles.BidHistory}>
      <p>Bid history</p>
      <div className={styles.bidHistoryList}>
        {bids?.slice(0, 3).map((bid) => (
          <BidHistoryItem
            key={bid.timestamp}
            isCurrentWallet={bid.bidder === currentAddress}
            {...bid}
          />
        ))}
      </div>
    </div>
  );
}

export default BidHistory;
