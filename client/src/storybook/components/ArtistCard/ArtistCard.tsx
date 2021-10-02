import React from 'react';
import copy from '@copy';
import { Button, TraitsBlock } from '@uiComponents';
import { IPillboxProps, ITraitsDefinition } from '@uiTypes';
import Pillbox from '../Pillbox/Pillbox';

import styles from './ArtistCard.scss';

export interface IArtistCardProps {
  avatar?: JSX.Element;
  name: string;
  traits?: ITraitsDefinition;
  isShowingActiveArtist?: boolean;
  doShowExternalLink?: boolean;
  withPadding?: boolean;
  withBackground?: boolean;
  ctaButton?: JSX.Element;
}

export const ArtistCard = ({
  avatar,
  name,
  traits,
  isShowingActiveArtist = false,
  doShowExternalLink = false,
  withPadding = true,
  withBackground = true,
  ctaButton
}: IArtistCardProps): JSX.Element => {
  const subject = isShowingActiveArtist ? copy.active_artist : copy.artist;

  const pillboxProps: IPillboxProps = {
    image: avatar,
    subject,
    subHeader: name,
    withPadding,
    withBackground,
    cta: ctaButton ? ctaButton : null
  };

  if (doShowExternalLink) {
    pillboxProps.secondaryCta = (
      <Button to={'TODO'} type='minimal' isFullWidth={true}>
        Opensea
      </Button>
    );
  }

  return (
    <Pillbox {...pillboxProps}>
      <div className={styles.traits}>
        <TraitsBlock traits={traits} />
      </div>
    </Pillbox>
  );
};

export default ArtistCard;
