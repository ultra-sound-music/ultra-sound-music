import { ReactElement, ReactNode } from 'react';
import cn from 'clsx';

import BidBoxInfo from './BidBoxInfo/BidBoxInfo';
import BidBoxForm from './BidBoxForm/BidBoxForm';
import BidHistory from '../BidHistory/BidHistory';

import styles from './BidBox.scss';

export interface IBidBoxProps {
  info?: [ReactElement<typeof BidBoxInfo>, ReactElement<typeof BidBoxInfo>];
  message?: ReactNode;
  cta?: ReactElement<typeof BidBoxForm>;
  history: ReactElement<typeof BidHistory>;
  isLoading: boolean;
}

export const BidBox = ({ info, message, cta, history, isLoading }: IBidBoxProps) => {
  return (
    <div className={cn(styles.BidBox, isLoading && styles.processing)}>
      <div className={styles.body}>
        {info && <div className={styles.info}>{info}</div>}
        {message && <div className={styles.message}>{message}</div>}
        {cta && <div className={styles.cta}>{cta}</div>}
      </div>
      <div className={styles.history}>{history}</div>
    </div>
  );
};

export default BidBox;
