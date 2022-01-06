import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'clsx';

import Spinner from '../Spinner/Spinner';

import styles from './Button.scss';

export type TButtonType = 'primary' | 'secondary';

export interface IButtonProps {
  type?: TButtonType;
  image?: JSX.Element;
  to?: typeof Link.prototype.to;
  isFullWidth?: boolean;
  isWide?: boolean;
  isDisabled?: boolean;
  isProcessing?: boolean;
  isExternal?: boolean;
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
  isExternal = false,
  onClick,
  children,
  ...props
}: IButtonProps): JSX.Element => {
  const disabled = isDisabled || isProcessing;
  const classNames = cn(
    styles.Button,
    styles[type],
    { [styles.withImage]: !!image },
    { [styles.disabled]: disabled },
    { [styles.fullWidth]: isFullWidth },
    { [styles.wide]: isWide }
  );

  const content = (
    <>
      {image ? <span className={styles.image}>{image}</span> : null}
      {children ? <span className={styles.content}>{children}</span> : ''}
      {isProcessing && <Spinner cover="relative" />}
    </>
  );

  if (to && !disabled) {
    if (isExternal) {
      return (
        <a
          href={to}
          className={classNames}
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <Link to={to} className={classNames} {...props}>
        {content}
      </Link>
    );
  }

  console.log('Button: ', { classNames, disabled, onClick, props });

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
