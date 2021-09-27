import React, { useState } from 'react';
import Options from './Options';

import styles from './Selector.scss';

import { IOptionsOption } from './Options';

export interface ISelectorProps {
  title?: React.ReactNode;
  select: React.ReactNode;
  options?: IOptionsOption[];
  onSelect: () => void;
}

export const Selector = ({
  title,
  select,
  options
}: ISelectorProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.Selector}>
      <div onClick={() => setIsOpen(true)}>{select}</div>
      <Options
        title={title}
        options={options}
        isOpen={isOpen}
        onHide={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Selector;
