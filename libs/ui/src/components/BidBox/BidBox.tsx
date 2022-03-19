import { ReactElement } from 'react';
import cn from 'clsx';

import BidBoxStatus from './BidBoxStatus/BidBoxStatus';
import BidBoxInfo from './BidBoxInfo/BidBoxInfo';
import BidBoxForm from './BidBoxForm/BidBoxForm';
import BidHistory from '../BidHistory/BidHistory';

import styles from './BidBox.scss';

export interface IBidBoxProps {
  status: ReactElement<typeof BidBoxStatus>;
  info: [ReactElement<typeof BidBoxInfo>, ReactElement<typeof BidBoxInfo>];
  cta: ReactElement<typeof BidBoxForm>;
  history: ReactElement<typeof BidHistory>;
  isLoading: boolean;
}

export const BidBox = ({ status, info, cta, history, isLoading }: IBidBoxProps) => {
  return (
    <div className={cn(styles.BidBox, isLoading && styles.processing)}>
      {status}
      <div className={styles.body}>
        {info && <div className={styles.info}>{info}</div>}
        {cta && <div className={styles.cta}>{cta}</div>}
      </div>
      {history}
    </div>
  );
};

export default BidBox;
