import { ReactNode } from 'react';
import cn from 'clsx';

import styles from './Callout.scss';

export interface ICalloutProps {
  shout: boolean;
  children: ReactNode;
}

export function Callout({ children, shout = false }: ICalloutProps) {
  return <div className={cn(styles.Callout, shout && styles.shout)}>{children}</div>;
}

export default Callout;
