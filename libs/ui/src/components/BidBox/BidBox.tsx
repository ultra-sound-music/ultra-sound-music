import cn from 'clsx';
import { Button } from '../Button/Button';

import styles from './BidBox.scss';

/* eslint-disable-next-line */
export interface BidBoxProps {}

export function BidBox(props: BidBoxProps): JSX.Element {
  const classNames = cn(styles.BidBox);

  console.log('BidBox: ', { classNames, props, styles });

  return (
    <div className={classNames}>
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
  );
}

export default BidBox;
