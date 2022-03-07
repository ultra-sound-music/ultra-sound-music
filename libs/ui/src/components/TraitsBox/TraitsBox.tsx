import styles from './TraitsBox.scss';

/* eslint-disable-next-line */
export interface TraitsBoxProps {
  sanityCategory: string;
  fameCategory: string;
  swaggerCategory: string;
  melodicCategory: string;
  texturalCategory: string;
  energyCategory: string;
  biographyContent: string;
  badges: { key: string; value: string }[];
}

export const TraitsBox = (props: TraitsBoxProps): JSX.Element => (
  <div className={styles.mainContainer}>
    <div className={styles.left}>
      <div className={styles.top}>
        <h1>Personal Traits</h1>
        <div className={styles.personalTraits}>
          <div>
            <p className={styles.category}>Sanity</p>
            <p>{props.sanityCategory}</p>
          </div>
          <div>
            <p className={styles.category}>Fame</p>
            <p>{props.fameCategory}</p>
          </div>
          <div>
            <p className={styles.category}>Swagger</p>
            <p>{props.swaggerCategory}</p>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <h1>Biography</h1>
        <p>{props.biographyContent}</p>
      </div>
    </div>
    <div className={styles.right}>
      <div className={styles.top}>
        <h1>Audio Traits</h1>
        <div className={styles.audioTraits}>
          <div>
            <p className={styles.category}>Melodic Style</p>
            <p>{props.melodicCategory}</p>
          </div>
          <div>
            <p className={styles.category}>Textural Style</p>
            <p>{props.texturalCategory}</p>
          </div>
          <div>
            <p className={styles.category}>Energy</p>
            <p>{props.energyCategory}</p>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <h1>Badges</h1>
      </div>
    </div>
  </div>
);

export default TraitsBox;
