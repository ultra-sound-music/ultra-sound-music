import React from 'react';
import styles from './Dropdown.scss';
import { Avatar } from '../Avatar/Avatar';

export interface IDropDownOption {
  text: React.ReactNode;
  value: string;
}

export interface ITextBlockProps {
  options: Record<string, string>[];
}

export const Dropdown = ({ options }: ITextBlockProps): JSX.Element => {
  return (
    <div className={styles.Dropdown}>
      <button className={styles.dropButton}>
        <Avatar size='tiny' />
        {options[0].name} ∨
      </button>
      <div className={styles.dropdownContent}>
        {options.map(({ name }, i) => (
          <a href='#' key={i}>
            {name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
