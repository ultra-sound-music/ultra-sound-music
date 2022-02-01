import { ReactNode } from 'react';
import cn from 'clsx';

import styles from './Callout.scss';

export interface ICalloutProps {
  shout: false;
  children: ReactNode;
}

export function Callout({ children, shout }: ICalloutProps) {
  return (
    <div className={cn(styles.Callout, shout && styles.shout)}>{children}</div>
  );
}

export default Callout;
