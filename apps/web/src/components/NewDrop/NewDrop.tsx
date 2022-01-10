import { BidBox, Col, Grid } from '@usm/ui';

import styles from './NewDrop.scss';

export function NewDrop() {
  return (
    <Grid className={styles.NewDrop}>
      <Col start={1} end={11} className={styles.hero} />
      <Col start={12} end='end' className={styles.bidBox}>
        <BidBox />
      </Col>
    </Grid>
  );
}

export default NewDrop;
