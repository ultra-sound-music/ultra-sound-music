import React from 'react';
import styles from './Overlay.scss';

export interface IOverlayProps {
  children: React.ReactNode;
}

export const Overlay = ({ children }: IOverlayProps): JSX.Element => {
  return <div className={styles.Overlay}>{children}</div>;
};

export default Overlay;
