import React, { useState } from 'react';
import Options from './Options';

import styles from './Selector.scss';

import { IOptionsOption } from './Options';

export interface ISelectorProps {
  title?: React.ReactNode;
  select: React.ReactNode;
  options?: IOptionsOption[];
  onSelect?: () => void;
}

export const Selector = ({ title, select, options, onSelect }: ISelectorProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.Selector}>
      <div onClick={() => setIsOpen(true)}>{select}</div>
      <Options
        title={title}
        options={options}
        isOpen={isOpen}
        onSelect={onSelect}
        onHide={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Selector;
