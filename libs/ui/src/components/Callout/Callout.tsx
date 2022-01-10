import { ReactNode } from 'react';

import styles from './Callout.scss';

export interface ICalloutProps {
  children: ReactNode
}

export function Callout({ children }: ICalloutProps) {
  return (
    <div className={styles.Callout}>
      {children}
    </div>
  );
}

export default Callout;
