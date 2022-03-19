import React from 'react';
import cn from 'clsx';

import Link from '../Link/Link';
import Spinner from '../Spinner/Spinner';

import styles from './Button.scss';

export type TButtonType = 'primary' | 'secondary' | 'inactive';

export interface IButtonProps {
  type?: TButtonType;
  image?: JSX.Element;
  shape?: 'pill' | 'tile';
  to?: typeof Link.prototype.to;
  isFullWidth?: boolean;
  isWide?: boolean;
  isDisabled?: boolean;
  isProcessing?: boolean;
  isExternal?: boolean;
  isSmall?: boolean;
  subtext?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({
  type = 'secondary',
  image,
  shape = 'pill',
  to,
  isFullWidth = false,
  isDisabled = false,
  isWide = false,
  isProcessing = false,
  isExternal = false,
  isSmall = false,
  onClick,
  subtext,
  children,
  ...props
}: IButtonProps): JSX.Element => {
  const disabled = isDisabled || isProcessing;
  const classNames = cn(
    styles.Button,
    styles[type],
    styles[shape],
    { [styles.withImage]: !!image },
    { [styles.disabled]: disabled },
    { [styles.fullWidth]: isFullWidth },
    { [styles.wide]: isWide },
    { [styles.small]: isSmall }
  );

  const content = (
    <>
      {image ? <span className={styles.image}>{image}</span> : null}
      {children ? <span className={styles.content}>{children}</span> : ''}
      {subtext ? <span className={styles.subtext}>{subtext}</span> : ''}
      {isProcessing && <Spinner cover='relative' />}
    </>
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

  return (
    <button
      type='button'
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
