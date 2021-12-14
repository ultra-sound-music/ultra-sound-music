import React from 'react';
import { connect } from 'react-redux';

import { ArtistCard, Hero } from '@uiComponents';
import { FullLayout } from '@layouts';
import { IRootState } from '@store/types';
import usm from '@store/usm';
import PlaybackButton from '@appComponents/Buttons/PlaybackButton/PlaybackButton';

import styles from './ArtistsPage.scss';

export type TArtistsPageProps = IArtistsPageState & IArtistsPageActions;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IArtistsPageState {
  artists: Record<string, unknown>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IArtistsPageActions {}

export class ArtistsPage extends React.Component<TArtistsPageProps> {
  renderArtist(artist): JSX.Element {
    return (
      <li key={artist.id} className={styles.artist}>
        <div className={styles.hero}>{<Hero src={artist.image} />}</div>
        <div className={styles.info}>
          {
            <ArtistCard
              name={artist.name}
              traits={artist.artistTraits}
              ctaButton={<PlaybackButton entityId={artist.id} />}
            />
          }
        </div>
      </li>
    );
  }

  render(): JSX.Element {
    return (
      <FullLayout>
        <div className={styles.ArtistsPage}>
          <ul>{this.props.artists.map(this.renderArtist)}</ul>
        </div>
      </FullLayout>
    );
  }
}

export function mapState(state: IRootState): IArtistsPageState {
  return {
    artists: usm.selectors.selectAllArtistEntities(state)
  };
}

export const mapDispatch: IArtistsPageActions = {};

export default connect(mapState, mapDispatch)(ArtistsPage);
