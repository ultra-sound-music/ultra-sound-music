import React from 'react';
import styles from './FullLayout.scss';

export interface IFullLayoutProps {
  children: JSX.Element;
}

export const FullLayout = ({ children }: IFullLayoutProps): JSX.Element => {
  return <div className={styles.FullLayout}>{children}</div>;
};

export default FullLayout;
