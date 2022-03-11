import { Grid } from '@usm/ui';

import AuctionContainer from '../AuctionContainer/AuctionContainer';

import styles from './NewDrop.scss';

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
