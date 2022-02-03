import stampUrl from '@usm/assets/img/drop_stamp_jambots.png';

import Image from '../Image/Image';

import styles from './CollectionStamp.scss';

export function CollectionStamp() {
  return (
    <div className={styles.CollectionStamp}>
      <div className={styles.usm}>
        Ultra
        <br />
        Sound
        <br />
        Music
      </div>
      <Image src={stampUrl} className={styles.stamp} />
    </div>
  );
}

export default CollectionStamp;
