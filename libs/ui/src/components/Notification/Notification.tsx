import cn from 'classnames';
import {
  RiCloseCircleFill,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiErrorWarningFill,
  RiInformationFill
} from 'react-icons/ri';

import Spinner from '../Spinner/Spinner';

import styles from './Notification.scss';

const iconMap = {
  info: RiInformationFill,
  warn: RiErrorWarningFill,
  success: RiCheckboxCircleFill,
  error: RiCloseCircleFill,
  processing: () => (
    <div className={styles.spinner}>
      <Spinner isFullSize={true} />
    </div>
  )
};

export interface INotificationProps {
  type?: keyof typeof iconMap;
  title?: string;
  message?: React.ReactNode;
  timeout?: number;
  isVisible?: boolean;
  onHide: () => void;
}

export const Notification = ({
  type = 'info',
  title,
  message,
  timeout,
  isVisible = false,
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

  const Icon = iconMap[type];
  const classNames = cn(styles.Notification, isVisible && styles.visible, styles[type]);

  return (
    <div className={classNames}>
      <div className={styles.icon}>
        <Icon />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>{message}</div>
      </div>
      <div className={styles.closex} onClick={onHideHandler}>
        X
      </div>
    </div>
  );
};

export default Notification;
