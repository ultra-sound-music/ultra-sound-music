import cn from 'clsx';
import { Button } from '../Button/Button';
import Paginate from '../Paginate/Paginate';

import styles from './BidBox.scss';

/* eslint-disable-next-line */
export interface BidBoxProps {}

export function BidBox(props: BidBoxProps): JSX.Element {
  console.log('BidBox: ', { props, styles });

  const hours = 13;
  const minutes = 27;
  const seconds = 53;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <h1>Jam Bot #1</h1>
        <div className={styles.arrowContainer}>
          <Paginate></Paginate>
        </div>
      </div>
      <div className={styles.timerContainer}>
        <p>
          Auction ends in {hours}hours {minutes}minutes {seconds}seconds
        </p>
      </div>
      <div className={styles.bidBoxContainer}>
        <div className={styles.info}>
          <div className={styles.currentBid}>
            <p>Current Bid</p>
            <div className={styles.currentBidValue}>
              <h2>173.50 SOL</h2>
            </div>
          </div>
          <div className={styles.walletBalance}>
            <p>Connect a Wallet</p>
            <div className={styles.walletBalanceValue}>
              <h2>-</h2>
            </div>
          </div>
        </div>
        <div className={styles.form}>
          <p>Connect a Wallet</p>
          <div className={styles.formInputBox}>
            <div className={styles.formInput}></div>
            <Button isDisabled type="primary">
              Connect
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.bidHistoryContainer}>
        <p>Bid history</p>
        <div className={styles.bidHistoryList}>
          <div className={styles.bidHistoryItem}>
            <div className={styles.bidAmount}>
              <p>173.5 SOL</p>
            </div>
            <div className={styles.bidTime}>
              <p>19 seconds ago</p>
            </div>
            <div className={styles.bidWalletAddress}>
              <p>0x94..EBe0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BidBox;
