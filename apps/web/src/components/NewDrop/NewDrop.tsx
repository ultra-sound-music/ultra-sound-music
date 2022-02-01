import { BidBox, Grid } from '@usm/ui';

import styles from './NewDrop.scss';

export function NewDrop() {
  return (
    <Grid className={styles.NewDrop}>
      <div className={styles.hero} />
      <div className={styles.bidBox}>{/* <BidBox /> */}</div>
    </Grid>
  );
}

export default NewDrop;
