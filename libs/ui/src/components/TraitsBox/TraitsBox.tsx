import cn from 'clsx';
import { copy } from '@usm/content';

import AnimatedMeter from '../AnimatedMeter/AnimatedMeter';
import MusicalTrait from '../MusicalTrait/MusicalTrait';
import Badges from '../Badges/Badges';

import styles from './TraitsBox.scss';

export interface IUsmNftAttributes {
  trait_type: string;
  value: string;
  display_type: string;
}

export interface TraitsBoxProps {
  description?: string;
  attributes?: IUsmNftAttributes[];
}

export type MusicalTraitType = keyof typeof musicalTraitsMap;

const musicalTraitsMap = {
  energy: 'energy',
  'melodic style': 'melody',
  'textural style': 'texture'
};
const character = ['sanity', 'fame', 'swagger'];
const badge = [''];

export const TraitsBox = ({ description, attributes = [] }: TraitsBoxProps): JSX.Element => {
  attributes = attributes.map((attr) => ({
    trait_type: attr.trait_type?.toLowerCase(),
    value: attr.value?.toLowerCase?.(),
    display_type: attr.display_type?.toLowerCase()
  }));

  const characterTraits = attributes.filter((attr) => character.includes(attr.trait_type));
  const hasCharacterTraits = !!characterTraits.length;
  const musicalTraits = attributes.flatMap(({ trait_type, value }) =>
    trait_type?.toLocaleLowerCase() in musicalTraitsMap
      ? [{ name: musicalTraitsMap[trait_type as MusicalTraitType], value }]
      : []
  );
  const hasMusicalTraits = !!musicalTraits.length;

  const badges = attributes.filter((attr) => badge.includes(attr.trait_type));
  const hasBadges = true; //!!badges.length;

  return (
    <div className={styles.TraitsBox}>
      {hasCharacterTraits && (
        <div className={styles.traitSection}>
          <div className={styles.traitHeader}>{copy.characterTraits}</div>
          <div className={cn(styles.traits, styles.characterTraits)}>
            {characterTraits?.map(({ trait_type, value }) => (
              <AnimatedMeter
                key={trait_type}
                meter={2}
                label={trait_type}
                name={value}
                value={[10, 12]}
              />
            ))}
          </div>
        </div>
      )}
      {hasMusicalTraits && (
        <div className={styles.traitSection}>
          <div className={styles.traitHeader}>{copy.musicalTraits}</div>
          <div className={styles.traits}>
            {musicalTraits?.map(({ name, value }) => (
              <MusicalTrait key={name + value} name={name} value={value} />
            ))}
          </div>
        </div>
      )}
      <div className={styles.traitSection}>
        <div className={styles.traitHeader}>{copy.biography}</div>
        <p className={styles.bio}>{description}</p>
      </div>
      {hasBadges && (
        <div className={styles.traitSection}>
          <div className={styles.traitHeader}>{copy.badges}</div>
          <div className={styles.traits}>
            <Badges play={true} names={['debut', 'hometown', 'version']} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TraitsBox;
