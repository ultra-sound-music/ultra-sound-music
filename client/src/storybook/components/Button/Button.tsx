import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { Spinner } from '../../components';
import styles from './Button.scss';

export type TButtonType = 'primary' | 'secondary' | 'minimal';

export interface IButtonProps {
  type?: TButtonType;
  image?: JSX.Element;
  to?: typeof Link.prototype.to;
  isFullWidth?: boolean;
  isWide?: boolean;
  isSlim?: boolean;
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
  isSlim = false,
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
    { [styles.slim]: isSlim },
    { [styles.wide]: isWide }
  );

  if (to && !disabled) {
    if (isExternal) {
      return (
        <a
          href={to}
          className={classNames}
          target='_blank'
          rel='noreferrer'
          {...props}
        >
          {image ? <span className={styles.image}>{image}</span> : null}
          {children ? <span className={styles.content}>{children}</span> : ''}
          {isProcessing && <Spinner cover='relative' />}
        </a>
      );
    }

    return (
      <Link to={to} className={classNames} {...props}>
        {image ? <span className={styles.image}>{image}</span> : null}
        {children ? <span className={styles.content}>{children}</span> : ''}
        {isProcessing && <Spinner cover='relative' />}
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
      {image ? <span className={styles.image}>{image}</span> : null}
      {children ? <span className={styles.content}>{children}</span> : ''}
      {isProcessing && <Spinner cover='relative' />}
    </button>
  );
};

export default Button;
