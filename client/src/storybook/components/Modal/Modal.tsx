import React from 'react';
import cn from 'classnames';
import ReactModal from 'react-modal';

import { Button, Pillbox } from '@uiComponents';

import styles from './Modal.scss';

export interface IModalProps {
  subject?: React.ReactNode;
  title?: React.ReactNode;
  shouldCloseOnEscape?: boolean;
  withCloseX?: boolean;
  withCloseButton?: boolean;
  isOpen: boolean;
  ctaButton?: JSX.Element;
  onHide?: () => void;
  children?: React.ReactNode;
}

export const Modal = ({
  subject,
  title,
  shouldCloseOnEscape = true,
  withCloseX = true,
  isOpen,
  withCloseButton = true,
  ctaButton,
  onHide,
  children
}: IModalProps): JSX.Element => {
  const classNames = cn(styles.Modal);
  const overlayClassNames = cn(styles.overlay);

  const props = {
    className: classNames,
    overlayClassName: overlayClassNames,
    isOpen,
    shouldCloseOnEscape,
    appElement: document?.getElementById('root') || undefined,
    onRequestClose: onHide
  };

  return (
    <ReactModal {...props}>
      <Pillbox
        subject={subject}
        subHeader={<div className={styles.title}>{title}</div>}
        cta={ctaButton}
        secondaryCta={
          withCloseButton && (
            <Button type='secondary' onClick={onHide}>
              Close
            </Button>
          )
        }
      >
        <div className={styles.body}>{children}</div>
      </Pillbox>
      {withCloseX && (
        <div className={styles.x} onClick={onHide}>
          X
        </div>
      )}
    </ReactModal>
  );
};

export default Modal;
