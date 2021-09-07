import React from 'react';
import cn from 'classnames';

import styles from './Trait.scss';

export enum ETraitSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum ETraitStyle {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface ITraitProps {
  name: string;
  style?: ETraitStyle;
  size?: ETraitSize;
}

export const Trait = ({
  name,
  style = ETraitStyle.DARK,
  size = ETraitSize.SMALL
}: ITraitProps): JSX.Element => {
  const classNames = cn(styles.Trait, styles[style], styles[size]);

  return <div className={classNames}>{name}</div>;
};

export default Trait;
