import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { Spinner } from '../../components';
import styles from './Button.scss';

export type TButtonType = 'primary' | 'secondary' | 'minimal';

export interface IButtonProps {
  type?: TButtonType;
  image?: JSX.Element;
  to?: string;
  isFullWidth?: boolean;
  isWide?: boolean;
  isDisabled?: boolean;
  isProcessing?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({
  type = 'secondary',
  image,
  to,
  isFullWidth = false,
  isDisabled = false,
  isWide = false,
  isProcessing = false,
  onClick,
  children,
  ...props
}: IButtonProps): JSX.Element => {
  const disabled = isDisabled || isProcessing;
  const classNames = cn(
    styles.Button,
    styles[type],
    { [styles.disabled]: disabled },
    { [styles.fullWidth]: isFullWidth },
    { [styles.wide]: isWide }
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classNames} {...props}>
        {isProcessing && <Spinner cover={true} />}
        {children ? <span className={styles.text}>{children}</span> : ''}
        {image ? <span className={styles.image}>{image}</span> : null}
      </Link>
    );
  }

  return (
    <button
      type='button'
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {isProcessing && <Spinner cover={true} />}
      {children ? <span className={styles.text}>{children}</span> : ''}
      {image ? <span className={styles.image}>{image}</span> : null}
    </button>
  );
};

export default Button;
