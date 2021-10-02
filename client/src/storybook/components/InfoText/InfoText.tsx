import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import cn from 'classnames';

import styles from './InfoText.scss';

export interface IInfoProps {
  onlyShowOnHover?: boolean;
  children: string;
}

export const InfoText = ({
  onlyShowOnHover = true,
  children
}: IInfoProps): JSX.Element => {
  const classnames = cn(styles.content, {
    [styles.onlyShowOnHover]: onlyShowOnHover
  });

  return (
    <div className={styles.InfoText}>
      <FaInfoCircle />
      <div className={classnames}>{children}</div>
    </div>
  );
};

export default InfoText;
