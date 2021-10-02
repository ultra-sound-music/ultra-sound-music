import React, { useState, useCallback } from 'react';

import { Paginate } from '@uiComponents';

import styles from './Carousel.scss';

export interface ICarouselProps {
  onClickPrev?: (p: number, n: number) => void;
  onClickNext?: (p: number, n: number) => void;
  children: React.ReactNode | React.ReactNode[];
}

export const Carousel = ({
  onClickPrev,
  onClickNext,
  children
}: ICarouselProps): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(0);

  const childrensArray = React.Children.toArray(children);
  const totalCount = childrensArray.length;

  const goPrev = useCallback(() => {
    if (activeIndex <= 0) {
      return;
    }

    const newIndex = activeIndex - 1;
    if (onClickPrev) {
      onClickPrev(newIndex, activeIndex);
    }
    setActiveIndex(newIndex);
  }, [activeIndex, childrensArray]);

  const goNext = useCallback(() => {
    if (activeIndex >= totalCount - 1) {
      return;
    }

    const newIndex = activeIndex + 1;
    if (onClickNext) {
      onClickNext(newIndex, activeIndex);
    }
    setActiveIndex(newIndex);
  }, [activeIndex, childrensArray]);

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === totalCount - 1;
  return (
    <div className={styles.Carousel}>
      <Paginate
        onClickPrev={!isFirst ? goPrev : void 0}
        onClickNext={!isLast ? goNext : void 0}
      />
      <div className={styles.item}>{childrensArray[activeIndex]}</div>
    </div>
  );
};

export default Carousel;
