import { Callout, Col, CollectionStamp, Grid, Link } from '@usm/ui';
import { urls } from '@usm/content';

import styles from './ComingSoon.scss';

export function ComingSoon() {
  return (
    <Grid className={styles.ComingSoon}>
      <div className={styles.heroBg} />
      <Col start={2} end={10}>
        <div className={styles.stamp}>
          <CollectionStamp />
        </div>
        <div className={styles.callout}>
          <Callout>
            ** Coming Soon ** <br />
            Join the <Link to={urls.usmDiscord}>Discord</Link> or follow us on{' '}
            <Link to={urls.usmTwitter}>Twitter</Link>!
          </Callout>
        </div>
      </Col>
    </Grid>
  );
}

export default ComingSoon;
