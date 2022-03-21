import { InputHTMLAttributes, RefObject } from 'react';

export type IInputProps = InputHTMLAttributes<HTMLInputElement> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function Input({ type = 'text', innerRef, ...props }: IInputProps) {
  return <input type={type} ref={innerRef} {...props} />;
}

export default Input;
