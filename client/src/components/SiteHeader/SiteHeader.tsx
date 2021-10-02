import React from 'react';
import { connect } from 'react-redux';
import {
  SiteHeader as UiSiteHeader,
  Selector,
  Button,
  Avatar,
  TopNav
} from '@uiComponents';
import ConnectButton from '@appComponents/Buttons/ConnectButton/ConnectButton';

import usm from '@store/usm';
import core from '@store/core';
import configs from '@store/configs';
import { IRootState } from '@store/types';

import copy from '@copy';

export interface ISiteHeaderProps {
  isArtistOnly: boolean;
  activeArtistName: string;
  activeArtistImageSrc: string;
  ownedArtists: Record<string, string>[];
}

const topNavItems = [
  {
    itemName: 'home',
    isRoot: true,
    text: 'Home',
    to: '/'
  },
  {
    itemName: 'bands',
    text: 'Bands',
    to: '/bands'
  },
  {
    itemName: 'tracks',
    text: 'Tracks',
    to: '/tracks'
  }
];

const artistOnlyTopNavItems = [
  {
    itemName: 'artists',
    text: 'Artists',
    to: '/artists'
  },
  {
    itemName: 'memplayer',
    text: 'Mempool Player',
    to: '/memplayer'
  }
];

export class SiteHeader extends React.Component<ISiteHeaderProps> {
  renderArtistOnlyTopNav = (): JSX.Element => {
    return <TopNav items={artistOnlyTopNavItems} />;
  };

  renderTopNav = (): JSX.Element => {
    return <TopNav items={topNavItems} />;
  };

  generateArtistSelector = (): JSX.Element => {
    if (!this.props.activeArtistName) {
      return;
    }

    return (
      <Selector
        title={copy.switch_artist}
        select={
          <Button
            isSlim={true}
            image={<Avatar src={this.props.activeArtistImageSrc} size='tiny' />}
          >
            {this.props.activeArtistName}
          </Button>
        }
        options={this.props.ownedArtists.map((artist) => {
          return {
            value: artist.id,
            content: artist.name
          };
        })}
        onSelect={() => {
          console.log('Test');
        }}
      />
    );
  };

  render(): JSX.Element {
    const items = this.props.isArtistOnly ? artistOnlyTopNavItems : topNavItems;

    return (
      <UiSiteHeader
        nav={<TopNav items={items} />}
        artistSelector={this.generateArtistSelector()}
        connectButton={<ConnectButton />}
      />
    );
  }
}

export function mapState(state: IRootState): ISiteHeaderProps {
  return {
    isArtistOnly: configs.selectors.getIsArtistOnly(state),
    activeArtistName: usm.selectors.getActiveArtistName(state),
    activeArtistImageSrc: usm.selectors.getActiveArtistImageUrl(state),
    ownedArtists: core.selectors.getOwnedArtists(state)
  };
}

export default connect(mapState)(SiteHeader);
