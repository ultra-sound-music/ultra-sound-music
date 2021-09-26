import React from 'react';
import cn from 'classnames';
import styles from './Pill.scss';

export interface IPillProps {
  isMuted?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Pill = ({
  isMuted = false,
  onClick,
  children
}: IPillProps): JSX.Element => {
  const classNames = cn(styles.Pill, { [styles.muted]: isMuted });

  return (
    <div className={classNames} onClick={onClick}>
      {children}
    </div>
  );
};

export default Pill;
