import React from 'react';
import { SiteHeader } from '@components';
import ConnectButton from '../Buttons/ConnectButton/ConnectButton';

export default class SiteHeaderContainer extends React.Component {
  render(): JSX.Element {
    return (
      <SiteHeader
        activePage='home'
        doShowActiveArtistPicker={false}
        connectButton={<ConnectButton />}
      />
    );
  }
}
