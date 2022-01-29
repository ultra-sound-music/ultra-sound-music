import { ReactNode } from 'react';
import cn from 'clsx';

import styles from './Grid.scss';

export interface IGridProps {
  className?: string;
  children: ReactNode;
}

export function Grid({ className, children }: IGridProps) {
  return <div className={`${cn(styles.Grid, className)}`}>{children}</div>;
}

export default Grid;
