import { ReactNode } from 'react';

import styles from './Pill.scss';

export interface IPillProps {
  label?: string;
  children?: ReactNode;
}

export function Pill({ label, children }: IPillProps) {
  return (
    <div className={styles.Pill}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.value}>
        {children}
      </div>
    </div>
  );
}

export default Pill;
