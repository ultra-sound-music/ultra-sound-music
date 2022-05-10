import { ReactNode } from 'react';
import styles from './Marquee.scss';

import { createArray } from '@usm/util-utils';

/* eslint-disable-next-line */
export interface MarqueeProps {
  children: ReactNode;
}

export function Marquee({ children }: MarqueeProps) {
  const array = createArray(100);

  return (
    <div className={styles.Marquee}>
      <div className={styles.innerContainer} aria-hidden='true'>
        {array.map(() => (
          <span className={styles.text}>{children}</span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
