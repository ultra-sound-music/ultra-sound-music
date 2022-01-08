import { ReactNode } from 'react';

import styles from './Grid.scss';

export interface IGridProps {
  children: ReactNode;
}

export function Grid({ children }: IGridProps ) {
  return (
    <div className={styles.Grid}>
      {children}
    </div>
  );
}

export default Grid;
