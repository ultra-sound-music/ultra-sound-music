import { Grid, AuctionContainer } from '@usm/ui';

import styles from './NewDrop.scss';

// VIJX
export function NewDrop() {
  return (
    <Grid className={styles.Grid}>
      <div className={styles.Avatar}></div>
      <div className={styles.BidBox}>
        <AuctionContainer />
      </div>
    </Grid>
  );
}

export default NewDrop;
