import { useState } from 'react';
import cn from 'clsx';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import styles from './Paginate.scss';

export interface IPaginateProps<T = any> {
  items?: T[];
  startIndex?: number;
  onPrev?(newIndex: number, item?: T): void;
  onNext?(newIndex: number, item?: T): void;
}

export const Paginate = ({
  items,
  startIndex = 0,
  onPrev,
  onNext
}: IPaginateProps): JSX.Element => {
  function onClickPrev() {
    if (activeIndex === 0) {
      return;
    }

    const newIndex = activeIndex - 1;
    onPrev?.(newIndex, items ? items[newIndex] : undefined);
    setActiveIndex(newIndex);
  }

  function onClickNext() {
    if (maxIndex && activeIndex === maxIndex) {
      return;
    }

    const newIndex = activeIndex + 1;
    onNext?.(newIndex, items ? items[newIndex] : undefined);
    setActiveIndex(newIndex);
  }

  const [activeIndex, setActiveIndex] = useState(startIndex);
  const maxIndex = items ? items.length - 1 : undefined;
  const withPrev = onPrev && activeIndex !== 0;
  const withNext = onNext && activeIndex !== maxIndex;

  const prevClassnames = cn(styles.item, styles[withPrev ? 'enabled' : 'disabled']);
  const nextClassnames = cn(styles.item, styles[withNext ? 'enabled' : 'disabled']);

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
