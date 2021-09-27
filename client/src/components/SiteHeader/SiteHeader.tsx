import React from 'react';
import { connect } from 'react-redux';
import {
  SiteHeader as SiteHeaderUi,
  Selector,
  Button,
  Avatar
} from '@uiComponents';
import ConnectButton from '@appComponents/Buttons/ConnectButton/ConnectButton';

import usm from '@store/usm';
import core from '@store/core';

import xolotl from '@images/mock/xolotl.png';
import copy from '@copy';

export interface ISiteHeaderProps {
  activeArtistName: string;
  activeArtistImageSrc: string;
  ownedArtists: Record<string, string>[];
}

export class SiteHeader extends React.Component<ISiteHeaderProps> {
  generateArtistSelector = () => {
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
      ></Selector>
    );
  };

  render(): JSX.Element {
    return (
      <SiteHeaderUi
        artistSelector={this.generateArtistSelector()}
        connectButton={<ConnectButton />}
      />
    );
  }
}

export function mapState(state): ISiteHeaderProps {
  return {
    activeArtistName: usm.selectors.getActiveArtistName(state),
    activeArtistImageSrc: usm.selectors.getActiveArtistImageUrl(),
    ownedArtists: core.selectors.getOwnedArtists(state)
  };
}

export default connect(mapState)(SiteHeader);
