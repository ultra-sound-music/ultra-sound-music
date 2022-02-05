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
        <div className={styles.callout}>
          <Callout shout={false}>
            <strong>
              NFT Drop Coming Soon
              <br />
            </strong>
            Get updates and giveaways on{' '}
            <Link to={urls.usmTwitter}>Twitter</Link> and{' '}
            <Link to={urls.usmDiscord}>Discord</Link>
          </Callout>
          <div>
            <p>
              Ultra Sound Music is dedicated to creating composable, thematic
              music NFTs backed by real world musicians, and empowering real
              world musicians.
            </p>
          </div>
        </div>
      </div>
    </Grid>
  );
}

export default ComingSoon;
