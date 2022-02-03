import { BidBox, Grid } from '@usm/ui';

import styles from './NewDrop.scss';

// VIJX
export function NewDrop() {
  return (
    <Grid className={styles.Grid}>
      <div className={styles.Avatar}></div>
      <div className={styles.BidBox}>
        <BidBox
          timeUntilAuctionEnd={{
            days: 0,
            hours: 21,
            minutes: 46,
            seconds: 11
          }}
          currentHighBidSol={173.5}
          isWalletConnected={true}
          walletBalanceSol={512.12}
          recentBids={[
            {
              amountSol: 173.5,
              userWalletAddress: '0x123',
              timeSinceBid: { seconds: 19 }
            },
            {
              amountSol: 101.0,
              userWalletAddress: '0xvasd12asd3',
              timeSinceBid: { minutes: 45 }
            }
          ]}
          isAuctionFinished={false}
          winningWalletAddress='0x1ds...sdfsa'
          traits={{ name: 'Jam Bot #1' }}
        />
      </div>
    </Grid>
  );
}

export default NewDrop;
