import React, { useCallback } from 'react';

import constants from '@constants';

import styles from './TraitsBlock.scss';

export interface ITraitsDefinition {
  texture: number;
  warmth: number;
  dissonance: number;
  aggression: number;
  space: number;
}

export interface ITraitsBlockProps {
  traits?: ITraitsDefinition;
}

export const TraitsBlock = ({ traits }: ITraitsBlockProps): JSX.Element => {
  const renderTrait = useCallback(({ name, value = 0 }) => {
    const inlineStyles = {
      width: `${Math.min(value, 5) * 20}%`
    };

    return (
      <li key={name} className={styles.trait}>
        <div className={styles.name}>
          {name} {value === 0 && '(?)'}
        </div>
        <div className={styles.meterContainer}>
          <div
            className={styles.meter}
            aria-label={value}
            style={inlineStyles}
          ></div>
        </div>
      </li>
    );
  }, []);

  const parseTraits = useCallback(
    (traits = {}) => {
      return constants.usm.traitNames.map((traitName) => ({
        name: traitName,
        value: traits[traitName]
      }));
    },
    [traits]
  );

  const parsedTraits = parseTraits(traits);

  return (
    <div className={styles.TraitsBlock}>
      {parsedTraits && (
        <ul className={styles.traitsList}>{parsedTraits.map(renderTrait)}</ul>
      )}
    </div>
  );
};

export default TraitsBlock;
