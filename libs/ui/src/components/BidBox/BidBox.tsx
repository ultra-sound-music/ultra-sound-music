import cn from 'clsx';

import styles from './BidBox.scss';

/* eslint-disable-next-line */
export interface BidBoxProps {}

export function BidBox(props: BidBoxProps): JSX.Element {
  const classNames = cn(styles.BidBox);

  console.log('BidBox: ', { classNames, props, styles });

  return (
    <div className={classNames}>
      <div className={styles.info}>
        <div className={styles.currentBid}></div>
        <div className={styles.walletBalance}></div>
      </div>
      <div className={styles.form}></div>
    </div>
  );
}

export default BidBox;
