import styles from './TraitsBox.scss';

/* eslint-disable-next-line */
export interface TraitsBoxProps {}

export function TraitsBox(props: TraitsBoxProps) {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.left}>
        <div className={styles.top}>
          <h1>Personal Traits</h1>
          <div className={styles.personalTraits}>
            <div>
              <p>Sanity</p>
            </div>
            <div>
              <p>Fame</p>
            </div>
            <div>
              <p>Swagger</p>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <h1>Biography</h1>
          <p>
            Lorem ipsum dolor sit amet, conse ctetuer adipiscing elit. Aenean
            comm odo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et ma gnis dis parturient montes, nascetur ridiculus mus.
            Cum sociis natoque penatibus.
          </p>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.top}>
          <h1>Audio Traits</h1>
        </div>
        <div className={styles.bottom}>
          <h1>Badges</h1>
        </div>
      </div>
    </div>
  );
}

export default TraitsBox;
