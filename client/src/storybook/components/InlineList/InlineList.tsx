import React from 'react';
import cn from 'classnames';

import styles from './InlineList.scss';

export interface ITraitProps {
  items: React.ReactNode[];
  rowGap?: 'tight' | 'normal';
}

export function renderListItem(
  item: JSX.Element | string,
  index: number
): JSX.Element {
  return (
    <li className={styles.item} key={index}>
      {item}
    </li>
  );
}

export const InlineList = ({
  items,
  rowGap = 'normal'
}: ITraitProps): JSX.Element => {
  const classNames = cn(styles.InlineList, styles[rowGap]);
  return <ul className={classNames}>{items.map(renderListItem)}</ul>;
};

export default InlineList;
