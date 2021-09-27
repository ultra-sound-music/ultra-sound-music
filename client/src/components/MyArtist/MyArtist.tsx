import React from 'react';

import { Image } from '@uiComponents';

export interface IMyArtistProps {
  artisId: string;
}

export class MyArtist extends React.Component<IMyArtistProps> {
  render(): JSX.Element {
    return (
      <div className='MyArtist'>
        <div className='artistImage'></div>
        <div className='artistStats'></div>
        <div className='startBand'></div>
        <div className='bandImage'></div>
        <div className='mintTrack'></div>
      </div>
    );
  }
}
