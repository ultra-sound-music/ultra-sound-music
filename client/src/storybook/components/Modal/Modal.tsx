import React, { useState, useCallback } from 'react';
import cn from 'classnames';
import ReactModal from 'react-modal';

import { Button, Pillbox } from '@components';

import styles from './Modal.scss';

export interface IModalProps {
  subject?: React.ReactNode;
  title?: React.ReactNode;
  shouldCloseOnEscape?: boolean;
  withCloseX?: boolean;
  withCloseButton?: boolean;
  ctaButton?: JSX.Element;
  onHideModal: () => void;
  children?: React.ReactNode;
}

export const Modal = ({
  subject,
  title,
  shouldCloseOnEscape = true,
  withCloseX = true,
  withCloseButton = true,
  ctaButton,
  onHideModal,
  children
}: IModalProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);

  const hideModal = useCallback(() => {
    setIsOpen(false);
    onHideModal();
  }, [isOpen]);

  const classNames = cn(styles.Modal);
  const overlayClassNames = cn(styles.overlay);

  const props = {
    className: classNames,
    overlayClassName: overlayClassNames,
    isOpen,
    shouldCloseOnEscape,
    appElement: document?.getElementById('root') || undefined,
    onRequestClose: onHideModal
  };

  return (
    <ReactModal {...props}>
      <Pillbox
        subject={subject}
        subHeader={<div className={styles.title}>{title}</div>}
        cta={ctaButton}
        secondaryCta={
          withCloseButton && (
            <Button type='secondary' onClick={hideModal}>
              Close
            </Button>
          )
        }
      >
        <div className={styles.body}>{children}</div>
      </Pillbox>
      {withCloseX && (
        <div className={styles.x} onClick={hideModal}>
          X
        </div>
      )}
    </ReactModal>
  );
};

export default Modal;
