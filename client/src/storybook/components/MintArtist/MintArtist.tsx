import React from 'react';

import { TraitsBlock } from '@uiComponents';
import { ITraitsDefinition } from '@uiTypes';

import styles from './MintArtist.scss';

export interface IMintArtistProps {
  name: string;
  price: number;
  traits?: ITraitsDefinition;
  ctaButton: JSX.Element;
  onClickPrev?: () => void;
  onClickNext?: () => void;
}

export const MintArtist = ({
  name,
  price,
  traits,
  ctaButton
}: IMintArtistProps): JSX.Element => {
  return (
    <div className={styles.MintArtist}>
      <div className={styles.header}>
        <div className={styles.artistName}>{name}</div>
        <div className={styles.price}>Ξ {price}</div>
      </div>
      <div className='content'>
        <div className={styles.traits}>
          <TraitsBlock traits={traits} />
        </div>
      </div>
      <div className={styles.buttons}>{ctaButton}</div>
    </div>
  );
};

export default MintArtist;
