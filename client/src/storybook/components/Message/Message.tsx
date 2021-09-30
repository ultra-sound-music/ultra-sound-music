import React from 'react';
import cn from 'classnames';

import styles from './Message.scss';

export interface IMessageProps {
  title: React.ReactNode;
  message: React.ReactNode;
  timeout?: number;
  isOpen: boolean;
  onHide: () => void;
}

export const Message = ({
  title,
  message,
  timeout = 0,
  isOpen,
  onHide
}: IMessageProps): JSX.Element => {
  if (timeout) {
    setTimeout(() => {
      onHide();
    }, timeout);
  }

  const state = isOpen ? 'open' : 'closed';
  const classNames = cn(styles.Message, styles[state]);

  return (
    <div className={classNames}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>{message}</div>
      <div className={styles.close} onClick={onHide}>
        X
      </div>
    </div>
  );
};

export default Message;
