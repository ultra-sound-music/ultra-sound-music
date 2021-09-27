import React, { useCallback } from 'react';
import styles from './PillSwitch.scss';
import cn from 'classnames';
import { FaCircle } from 'react-icons/fa';

export type TPillSwitchStatus = 'on' | 'pending' | 'off';
export interface IPillSwitchProps {
  status?: TPillSwitchStatus;
  isDisabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const PillSwitch = ({
  status,
  isDisabled = false,
  onClick,
  children
}: IPillSwitchProps): JSX.Element => {
  const onClickHandler = useCallback(() => {
    if (isDisabled) {
      return;
    }

    onClick();
  }, [isDisabled, onClick]);

  const classNames = cn(styles.PillSwitch, styles[status], {
    [styles.clickable]: onClick
  });

  return (
    <div className={classNames} onClick={onClickHandler}>
      {status && <div className={styles.icon}>{<FaCircle />}</div>}
      <div className={styles.text}>{children}</div>
    </div>
  );
};

export default PillSwitch;
