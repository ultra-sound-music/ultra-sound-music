import React from 'react';
import styles from './Toggle.scss';

export interface IToggleProps {
  label: string;
  onToggle: () => void;
}

export const Toggle = ({ label, onToggle }: IToggleProps): JSX.Element => {
  return (
    <div className={styles.Toggle}>
      <label className={styles.lable}>{label}</label>
      <div className={styles.toggleContainer} onClick={onToggle}>
        <div className={styles.toggleSwitch}></div>
      </div>
    </div>
  );
};

export default Toggle;
