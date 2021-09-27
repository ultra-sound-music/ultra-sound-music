import React from 'react';
import { TopNav } from '@uiComponents';
import { ITopNavItem } from '@uiTypes';
import styles from './SiteHeader.scss';

export interface ISiteHeaderProps {
  artistSelector?: React.ReactNode; // Should be a <Selector>
  connectButton?: React.ReactNode; // Should be a <PillSwitch>
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
  connectButton,
  artistSelector
}: ISiteHeaderProps): JSX.Element => {
  return (
    <div className={styles.SiteHeader}>
      <div className={styles.topNav}>
        <TopNav items={pageConfigs} />
      </div>

      {artistSelector && (
        <div className={styles.artistSelector}>{artistSelector}</div>
      )}
      {connectButton && <div className='connect'>{connectButton}</div>}
    </div>
  );
};

export default SiteHeader;
