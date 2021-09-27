import React from 'react';
import { connect } from 'react-redux';

import copy from '@copy';
import xolotl from '@images/mock/xolotl.png';
import { Button, ArtistCard, Avatar, BandCard } from '@uiComponents';
import { ITraitDefinition } from '@uiTypes';

import { SidebarLayout } from '@layouts';
import { IRootState } from '@store/types';
import ui from '@store/ui';
import usm from '@store/usm';

import styles from './BandsPage.scss';

export type TBandsPageProps = IBandsPageState & IBandsPageActions;

export interface tempBand {
  name: string;
  members: string[];
  id: string;
  tokenId: string;
}

export interface IBandsPageState {
  bands: tempBand[];
  activeArtistImageUrl: string;
  activeArtistName: string;
  activeArtistId: string;
  activeArtistTraits: ITraitDefinition[];
}

export interface IBandsPageActions {
  showStartBandModal: () => void;
  showJoinBandModal: ({ bandId: string }) => void;
  showMintTrackModal: ({ bandId: string }) => void;
}

export class BandsPage extends React.Component<TBandsPageProps> {
  openStartBandModal = (): void => {
    this.props.showStartBandModal();
  };

  openJoinBandModal = (bandId: string): void => {
    this.props.showJoinBandModal({ bandId });
  };

  openMintTrackModal = (bandId: string): void => {
    this.props.showMintTrackModal({ bandId });
  };

  renderSidebar = (): JSX.Element => {
    return (
      <div className={styles.sidebar}>
        <div>
          <ArtistCard
            avatar={<Avatar src={this.props.activeArtistImageUrl} />}
            name={this.props.activeArtistName}
            traits={this.props.activeArtistTraits}
            isShowingActiveArtist={true}
            doShowExternalLink={true}
            withPadding={false}
            withBackground={false}
            ctaButton={
              <Button onClick={this.openStartBandModal} type='primary'>
                {copy.start_band}
              </Button>
            }
          />
        </div>
      </div>
    );
  };

  renderJoinBandButton = (bandId: string): JSX.Element => {
    return (
      <Button type='secondary' onClick={() => this.openJoinBandModal(bandId)}>
        {copy.join_band}
      </Button>
    );
  };

  renderMintTrackButton = (bandId: string): JSX.Element => {
    return (
      <Button type='secondary' onClick={() => this.openMintTrackModal(bandId)}>
        {copy.join_band}
      </Button>
    );
  };

  isActiveArtistMemberOfBand = (bandMembers: string[]): boolean => {
    return bandMembers.includes(this.props.activeArtistId);
  };

  renderMain = (): JSX.Element => {
    const members = [xolotl, xolotl, xolotl, xolotl, xolotl, xolotl];
    return (
      <div className={styles.main}>
        <div className={styles.pageHeader}>Bands</div>
        <ul className={styles.bandsList}>
          {this.props.bands.map((band) => (
            <li key={band.name} className={styles.bandItem}>
              <BandCard
                name={band.name}
                members={members}
                ctaButton={
                  this.isActiveArtistMemberOfBand(band.members as string[])
                    ? this.renderMintTrackButton(band.id)
                    : this.renderJoinBandButton(band.id)
                }
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  render(): JSX.Element {
    return (
      <SidebarLayout sidebar={this.renderSidebar()} main={this.renderMain()} />
    );
  }
}

export function mapState(state: IRootState): IBandsPageState {
  return {
    bands: usm.selectors.selectAllBandEntities(state),
    activeArtistImageUrl: xolotl, // usm.selectors.getActiveArtistImageUrl(),
    activeArtistName: usm.selectors.getActiveArtistName(state),
    activeArtistId: usm.selectors.getActiveArtistId(state),
    activeArtistTraits: usm.selectors.getActiveArtistTraits()
  };
}

export const mapDispatch: IBandsPageActions = {
  showStartBandModal: ui.actions.showStartBandModal,
  showJoinBandModal: ui.actions.showJoinBandModal,
  showMintTrackModal: ui.actions.showMintTrackModal
};

export default connect(mapState, mapDispatch)(BandsPage);
