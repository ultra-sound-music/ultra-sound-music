import React from 'react';
import cn from 'clsx';
import ReactModal from 'react-modal';

import Button from '../Button/Button';

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

export function renderButtons(ctaButton?: JSX.Element, withCloseButton?: boolean, onHide?: () => void) {
  if (!ctaButton && !withCloseButton) {
    return;
  }

  return (
    <div className={styles.buttons}>
      {withCloseButton && <Button onClick={onHide} isFullWidth={true} type={ctaButton ? 'secondary' : 'primary'}>Close</Button>}
      {ctaButton}
    </div>    
  )
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
      {subject && <div className={styles.subject}>{subject}</div>}
      {title && <div className={styles.title}>{title}</div>}  
      <div className={styles.body}>{children}</div>
      {renderButtons(ctaButton, withCloseButton, onHide)}
      {withCloseX && (
        <div className={styles.x} onClick={onHide}>
          X
        </div>
      )}
    </ReactModal>
  );
};

export default Modal;
