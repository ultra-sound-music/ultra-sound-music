import React from 'react';
import copy from '@copy';
import { Button, TraitsBlock } from '@uiComponents';
import { IPillboxProps, ITraitDefinition } from '@uiTypes';
import Pillbox from '../Pillbox/Pillbox';

export interface IArtistCardProps {
  avatar?: JSX.Element;
  name: string;
  traits?: ITraitDefinition[];
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
    header: name,
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
      <TraitsBlock traits={traits} />
    </Pillbox>
  );
};

export default ArtistCard;
