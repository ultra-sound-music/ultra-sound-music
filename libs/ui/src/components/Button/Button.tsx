import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'clsx';

import Spinner from '../Spinner/Spinner';

import styles from './Button.scss';

export type TButtonType = 'primary' | 'secondary' | 'minimal';

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

  const inside = (
    <>
      {image ? <span className={styles.image}>{image}</span> : null}
      {children ? <span className={styles.content}>{children}</span> : ''}
      {isProcessing && <Spinner cover='relative' />}    
    </>
  );

  if (to && !disabled) {
    if (isExternal) {
      return <a 
        href = {to}
        className = {classNames}
        target = '_blank'
        rel = 'noreferrer'
        {...props}
      >{inside}</a>
    }

    return <Link
      to = {to}
      className = {classNames}
      {...props}
    >{inside}</Link>
  }

  return (
    <button
      type='button'
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >{inside}</button>
  );
};

export default Button;
