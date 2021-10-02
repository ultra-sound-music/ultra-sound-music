import React from 'react';
import cn from 'classnames';
import styles from './Spinner.scss';

export interface ISpinnerProps {
  cover?: 'relative' | 'fixed';
}

export const Spinner = ({ cover }: ISpinnerProps): JSX.Element => {
  const classNames = cn(styles.Spinner, { [styles[`cover_${cover}`]]: cover });
  return <div className={classNames}></div>;
};

export default Spinner;
