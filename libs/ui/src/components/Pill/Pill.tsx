import { ReactNode } from 'react';
import cn from 'clsx';

import styles from './Pill.scss';

export interface IPillProps {
  label?: string;
  shrink?: boolean;
  children?: ReactNode;
}

export function Pill({ label, shrink, children }: IPillProps) {
  return (
    <div className={styles.Pill}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={cn(styles.value, shrink && styles.shrink)}>
        {children}
      </div>
    </div>
  );
}

export default Pill;
