import React from 'react';
import { TopNav } from '../../components';
import { ITopNavItem } from '../../types';
import styles from './SiteHeader.scss';

export interface ISiteHeaderProps {
  activePage: 'home' | 'bands' | 'tracks' | 'socials';
  doShowActiveArtistPicker: boolean;
  connectButton: React.ReactNode;
}

export const pageConfigs: ITopNavItem[] = [
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

export const SiteHeader = ({
  connectButton
}: ISiteHeaderProps): JSX.Element => {
  return (
    <div className={styles.SiteHeader}>
      <div className={styles.topNav}>
        <TopNav items={pageConfigs} />
      </div>

      {/* <div className={styles.artistSelector}>-- Placeholder --</div> */}
      <div className='connect'>{connectButton}</div>
    </div>
  );
};

export default SiteHeader;
