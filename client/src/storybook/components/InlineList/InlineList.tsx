import React from 'react';
import cn from 'classnames';

import styles from './InlineList.scss';

export enum ERowGap {
  TIGHT = 'tight',
  NORMAL = 'normal'
}

export interface ITraitProps {
  items: JSX.Element[] | string[];
  rowGap?: ERowGap;
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
  rowGap = ERowGap.NORMAL
}: ITraitProps): JSX.Element => {
  const classNames = cn(styles.InlineList, styles[rowGap]);
  return <ul className={classNames}>{items.map(renderListItem)}</ul>;
};

export default InlineList;
