import React, { useCallback } from 'react';

import styles from './TraitsBlock.scss';

export interface ITraitDefinition {
  name: string;
  value: string | number;
}

export interface ITraitsBlockProps {
  traits: ITraitDefinition[];
}

export const TraitsBlock = ({ traits }: ITraitsBlockProps): JSX.Element => {
  const renderTrait = useCallback(({ name, value }) => {
    return (
      <li key={name} className={styles.trait}>
        <div>{name}</div>
        <div>{value}</div>
      </li>
    );
  }, []);

  return (
    <div className={styles.TraitsBlock}>
      <ul>
        {traits && (
          <ul className={styles.traitsList}>{traits.map(renderTrait)}</ul>
        )}
      </ul>
    </div>
  );
};

export default TraitsBlock;
