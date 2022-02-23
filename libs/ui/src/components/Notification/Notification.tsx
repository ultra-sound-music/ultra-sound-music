import cn from 'classnames';

import styles from './Notification.scss';

export interface INotificationProps {
  type?: 'info' | 'warn' | 'success' | 'error';
  message: React.ReactNode;
  timeout?: number;
  isOpen: boolean;
  onHide: () => void;
}

export const Notification = ({
  type = 'info',
  message,
  timeout = 0,
  isOpen,
  onHide
}: INotificationProps): JSX.Element => {
  function onHideHandler() {
    onHide?.();
  }

  if (timeout) {
    setTimeout(() => {
      onHideHandler();
    }, timeout);
  }

  const state = isOpen ? 'open' : 'closed';
  const classNames = cn(styles.Notification, styles[state], styles[type]);

  return (
    <div className={classNames}>
      <div className={styles.message}>{message}</div>
      <div className={styles.close} onClick={onHideHandler}>
        X
      </div>
    </div>
  );
};

export default Notification;
