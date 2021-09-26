import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

import styles from './InfoText.scss';

export interface IInfoProps {
  children: string;
}

export const InfoText = ({ children }: IInfoProps): JSX.Element => {
  return (
    <div className={styles.InfoText}>
      <FaInfoCircle />
      {children}
    </div>
  );
};

export default InfoText;
