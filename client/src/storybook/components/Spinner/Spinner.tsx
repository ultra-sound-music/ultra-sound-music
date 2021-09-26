import React from 'react';
import cn from 'classnames';
import styles from './Spinner.scss';

export interface ISpinnerProps {
  cover?: boolean;
}

export const Spinner = ({ cover }: ISpinnerProps): JSX.Element => {
  const classNames = cn(styles.Spinner, { [styles.cover]: cover });
  return <div className={classNames}></div>;
};

export default Spinner;
