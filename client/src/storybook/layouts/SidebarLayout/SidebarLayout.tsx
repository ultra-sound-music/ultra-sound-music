import React from 'react';
import styles from './SidebarLayout.scss';

export interface ISidebarLayoutProps {
  sidebar: JSX.Element;
  main: JSX.Element;
}

export const SidebarLayout = ({
  sidebar,
  main
}: ISidebarLayoutProps): JSX.Element => {
  return (
    <div className={styles.SidebarLayout}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.main}>{main}</div>
    </div>
  );
};

export default SidebarLayout;
