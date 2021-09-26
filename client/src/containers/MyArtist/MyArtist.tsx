import React from 'react';

import { Image } from '@components';

import { IMyArtistProps } from './MyArtist.types';

export class MyArtist extends React.Component<IMyArtistProps> {
  render() {
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
