import { ReactNode } from 'react';

import styles from './Grid.scss';

export interface IGridProps {
  className?: string;
  children: ReactNode;
}

export function Grid({ className, children }: IGridProps) {
  return <div className={`${styles.Grid} ${className}`}>{children}</div>;
}

export default Grid;
