import { CollectionStamp, Grid } from '@usm/ui';

import styles from './ComingSoon.scss';

export function ComingSoon() {
  return (
    <Grid className={styles.ComingSoon}>
      <div className={styles.stamp}>
        <CollectionStamp />
      </div>
      <div className={styles.heroBg} />
      <div className={styles.description}>
        <div className={styles.zinger}>
          Virtual musicians. <br />
          Backed by real world artists.
        </div>
      </div>
    </Grid>
  );
}

export default ComingSoon;
