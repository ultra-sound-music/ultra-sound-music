import { copy } from '@usm/content';

import AnimatedMeter from '../AnimatedMeter/AnimatedMeter';
import MusicalTrait from '../MusicalTrait/MusicalTrait';
import Badges from '../Badges/Badges';

import styles from './TraitsBox.scss';

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
  <div className={styles.TraitsBox}>
    <div className={styles.traitSection}>
      <div className={styles.traitHeader}>{copy.characterTraits}</div>
      <div className={styles.traits}>
        <AnimatedMeter
          meter={1}
          label='sanity'
          name='almost insane'
          value={[5, 7]}
        />
        <AnimatedMeter meter={2} label='fame' name='low key' value={[10, 12]} />
        <AnimatedMeter
          meter={3}
          label='swagger'
          name='in the clouds'
          value={[6, 10]}
        />
      </div>
    </div>
    <div className={styles.traitSection}>
      <div className={styles.traitHeader}>{copy.musicalTraits}</div>
      <div className={styles.traits}>
        <MusicalTrait name='energy' value='upbeat' />
        <MusicalTrait name='melody' value='complex' />
        <MusicalTrait name='texture' value='harmonic' />
      </div>
    </div>
    <div className={styles.traitSection}>
      <div className={styles.traitHeader}>{copy.biography}</div>
      <p>{props.biographyContent}</p>
    </div>
    <div className={styles.traitSection}>
      <div className={styles.traitHeader}>{copy.badges}</div>
      <div className={styles.traits}>
        <Badges play={true} names={['debut', 'hometown', 'version']} />
      </div>
    </div>
  </div>
);

export default TraitsBox;
