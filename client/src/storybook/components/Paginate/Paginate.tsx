import React from 'react';
import cn from 'classnames';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import styles from './Paginate.scss';

export interface IPaginateProps {
  onClickPrev?: () => void;
  onClickNext?: () => void;
}

export const Paginate = ({
  onClickPrev,
  onClickNext
}: IPaginateProps): JSX.Element => {
  const prevClassnames = cn(styles.item, {
    [styles.disabled]: !onClickPrev
  });

  const nextClassnames = cn(styles.item, {
    [styles.disabled]: !onClickNext
  });

  return (
    <div className={styles.Paginate}>
      <div className={prevClassnames} onClick={onClickPrev}>
        <FaArrowLeft />
      </div>
      <div className={nextClassnames} onClick={onClickNext}>
        <FaArrowRight />
      </div>
    </div>
  );
};

export default Paginate;
