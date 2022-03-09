import React from 'react';
import cn from 'clsx';
import ReactModal from 'react-modal';
import { RiCloseLine } from 'react-icons/ri';

import Button from '../Button/Button';

import styles from './Modal.scss';

export interface IModalProps {
  subject?: React.ReactNode;
  title?: React.ReactNode;
  shouldCloseOnEscape?: boolean;
  withCloseX?: boolean;
  withCloseButton?: boolean;
  isOpen: boolean;
  ctaButton?: React.ReactNode;
  body?: React.ReactNode;
  onHide?: () => void;
  children?: React.ReactNode;
}

export function renderButtons(
  ctaButton: React.ReactNode,
  withCloseButton?: boolean,
  onHide?: () => void
) {
  if (!ctaButton && !withCloseButton) {
    return;
  }

  return (
    <div className={styles.buttons}>
      {withCloseButton && (
        <Button onClick={onHide} isFullWidth={true} type={ctaButton ? 'secondary' : 'primary'}>
          Close
        </Button>
      )}
      {ctaButton}
    </div>
  );
}

export const Modal = ({
  subject,
  title,
  shouldCloseOnEscape = true,
  withCloseX = true,
  isOpen,
  withCloseButton = true,
  ctaButton,
  body,
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
      {subject && <div className={styles.subject}>{subject}</div>}
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.body}>{body || children}</div>
      {renderButtons(ctaButton, withCloseButton, onHide)}
      {withCloseX && <RiCloseLine className={styles.x} onClick={onHide} />}
    </ReactModal>
  );
};

export default Modal;
