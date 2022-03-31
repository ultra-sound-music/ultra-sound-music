import { ReactNode } from 'react';
import { Placeholder } from '../../Placeholder/Placeholder';

import styles from './BidBoxInfo.scss';

export interface IBidBoxInfoProps {
  title: ReactNode;
  icon?: ReactNode;
  body?: ReactNode;
  isLoading?: boolean;
}

export function BidBoxInfo({ title, icon, body, isLoading }: IBidBoxInfoProps) {
  const bodyContainer = isLoading ? (
    <Placeholder preset='rectangle' />
  ) : (
    <>
      {icon}
      <div className={styles.content}>{body}</div>
    </>
  );

  return (
    <div className={styles.BidBoxInfo}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{bodyContainer}</div>
    </div>
  );
}

export default BidBoxInfo;
