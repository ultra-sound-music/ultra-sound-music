import React from 'react';

import { Modal } from '../Modal/Modal';

import styles from './Options.scss';

export interface IOptionsOption {
  value: unknown;
  content: React.ReactNode;
}

export interface IOptionsProps {
  title?: React.ReactNode;
  options?: IOptionsOption[];
  isOpen: boolean;
  onSelect?: () => void;
  onHide: () => void;
}

export const Options = ({
  title,
  options = [],
  isOpen,
  onSelect,
  onHide
}: IOptionsProps): JSX.Element => {
  function onClickOption() {
    onSelect?.();
    onHide();
  }

  return (
    <Modal
      subject={title}
      isOpen={isOpen}
      onHide={onHide}
      withCloseButton={false}
    >
      {options.map((option, i) => {
        return (
          <div key={i} className={styles.option} onClick={onClickOption}>
            {option.content}
          </div>
        );
      })}
    </Modal>
  );
};

export default Options;
