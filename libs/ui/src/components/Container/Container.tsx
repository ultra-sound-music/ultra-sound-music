import { ReactNode } from 'react';

import styles from './Container.scss';

export interface IContainerProps {
  children: ReactNode;
}

export function Container({ children }: IContainerProps) {
  return (
    <div className={styles.Container}>
      {children}
    </div>
  );
}

export default Container;
