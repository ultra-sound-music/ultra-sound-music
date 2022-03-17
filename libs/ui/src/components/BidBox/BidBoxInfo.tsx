import { ReactNode } from 'react';

import styles from './BidBoxInfo.scss';

export interface IBidBoxInfoProps {
  title: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}

export function BidBoxInfo({ title, icon, children }: IBidBoxInfoProps) {
  return (
    <div className={styles.BidBoxInfo}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>
        {icon}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
