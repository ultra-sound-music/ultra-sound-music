import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import styles from './Button.scss';

export enum EButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum EButtonStyle {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface IButtonProps {
  isPrimary?: boolean;
  style?: EButtonStyle;
  size?: EButtonSize;
  text: string;
  subText: string;
  image: JSX.Element;
  to: string;
  onClick?: () => void;
}

export const Button = ({
  isPrimary = false,
  style = EButtonStyle.DARK,
  size = EButtonSize.MEDIUM,
  text,
  subText,
  image,
  to,
  onClick,
  ...props
}: IButtonProps): JSX.Element => {
  const role = isPrimary ? 'primary' : 'secondary';

  const classNames = cn(
    styles.Button,
    styles[size],
    styles[role],
    styles[style]
  );

  if (to) {
    return (
      <Link to={to} className={classNames} {...props}>
        {image ? image : null}
        {text ? text : ''}
        {subText ? subText : ''}
      </Link>
    );
  }

  return (
    <button type='button' className={classNames} onClick={onClick} {...props}>
      {image ? image : null}
      {text ? text : ''}
      {subText ? subText : ''}
    </button>
  );
};

export default Button;
