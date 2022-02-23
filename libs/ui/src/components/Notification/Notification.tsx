import cn from 'classnames';

import styles from './Notification.scss';

export interface INotificationProps {
  type: 'success' | 'error';
  title: React.ReactNode;
  message: React.ReactNode;
  timeout?: number;
  isOpen: boolean;
  onHide: () => void;
}

export const Notification = ({
  title,
  message,
  timeout = 0,
  isOpen,
  onHide
}: INotificationProps): JSX.Element => {
  if (timeout) {
    setTimeout(() => {
      onHide();
    }, timeout);
  }

  const state = isOpen ? 'open' : 'closed';
  const classNames = cn(styles.Notification, styles[state]);

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

export default Notification;
