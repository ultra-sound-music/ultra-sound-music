import React from 'react';

// import ReactModal from 'react-modal';
import { Modal } from '@uiComponents';

import styles from './Options.scss';

export interface IOptionsOption {
  value: unknown;
  content: React.ReactNode;
}

export interface IOptionsProps {
  title?: React.ReactNode;
  options?: IOptionsOption[];
  isOpen: boolean;
  onHide: () => void;
}

export const Options = ({
  title,
  options = [],
  isOpen,
  onHide
}: IOptionsProps): JSX.Element => {
  return (
    <Modal
      subject={title}
      isOpen={isOpen}
      onHide={onHide}
      withCloseButton={false}
    >
      {options.map((option, i) => {
        return (
          <div key={i} className={styles.option}>
            {option.content}
          </div>
        );
      })}
    </Modal>
  );
};

export default Options;
