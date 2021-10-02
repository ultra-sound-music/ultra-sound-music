import React from 'react';
import { connect } from 'react-redux';

import { IRootState } from '@store/types';

import styles from './ArtistsPage.scss';

export type TArtistsPageProps = IArtistsPageState & IArtistsPageActions;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IArtistsPageState {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IArtistsPageActions {}

export class ArtistsPage extends React.Component<TArtistsPageProps> {
  render(): JSX.Element {
    return <div className={styles.ArtistsPage}>Artists Page</div>;
  }
}

export function mapState(state: IRootState): IArtistsPageState {
  return {};
}

export const mapDispatch: IArtistsPageActions = {};

export default connect(mapState, mapDispatch)(ArtistsPage);
