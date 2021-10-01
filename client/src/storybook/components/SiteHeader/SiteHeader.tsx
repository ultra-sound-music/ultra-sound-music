import React from 'react';
import { TopNav } from '@uiComponents';
import { ITopNavItem } from '@uiTypes';
import styles from './SiteHeader.scss';

export interface ISiteHeaderProps {
  nav?: React.ReactNode; // Should be a <TopNav>
  artistSelector?: React.ReactNode; // Should be a <Selector>
  connectButton?: React.ReactNode; // Should be a <PillSwitch>
}

export const SiteHeader = ({
  nav,
  connectButton,
  artistSelector
}: ISiteHeaderProps): JSX.Element => {
  return (
    <div className={styles.SiteHeader}>
      {nav && <div className={styles.topNav}>{nav}</div>}

      {artistSelector && (
        <div className={styles.artistSelector}>{artistSelector}</div>
      )}
      {connectButton && <div className='connect'>{connectButton}</div>}
    </div>
  );
};

export default SiteHeader;
