import stampUrl from '@usm/images/stamp_jambots.png';

import Image from '../Image/Image';

import styles from './CollectionStamp.scss';

export function CollectionStamp() {
  return (
    <div className={styles.CollectionStamp}>
      <div className={styles.usm}>Ultra<br />Sound<br />Music</div>
      <div className={styles.stamp}><Image src={stampUrl} /></div>
    </div>
  );
}

export default CollectionStamp;
