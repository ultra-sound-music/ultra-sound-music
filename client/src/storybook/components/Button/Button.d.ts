/// <reference types="react" />
export declare enum EButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}
export declare enum EButtonStyle {
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
export declare const Button: ({
  isPrimary,
  style,
  size,
  text,
  subText,
  image,
  to,
  onClick,
  ...props
}: IButtonProps) => JSX.Element;
export default Button;
