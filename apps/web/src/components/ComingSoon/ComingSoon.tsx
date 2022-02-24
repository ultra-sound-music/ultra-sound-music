import { Callout, CollectionStamp, Grid, Link } from '@usm/ui';
import { urls } from '@usm/content';

import styles from './ComingSoon.scss';

export function ComingSoon() {
  return (
    <Grid className={styles.ComingSoon}>
      <div className={styles.stamp}>
        <CollectionStamp />
      </div>
      <div className={styles.heroBg} />
      <div className={styles.description}>
        <div>
          <div className={styles.title}>NFT Drop Coming Soon...</div>
          <div className={styles.zinger}>
            Ultra Sound Music is creating composable, thematic music NFTs backed
            by real world musicians, and empowering real world musicians.
          </div>
        </div>
        <div className={styles.callout}>
          <Callout shout={false}>
            Get updates and giveaways on{' '}
            <Link to={urls.usmTwitter}>Twitter</Link> and{' '}
            <Link to={urls.usmDiscord}>Discord</Link>
          </Callout>
        </div>
      </div>
    </Grid>
  );
}

export default ComingSoon;
