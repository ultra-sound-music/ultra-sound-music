import { InputHTMLAttributes } from 'react';

export type IRadioProps = InputHTMLAttributes<HTMLInputElement>;

export function Radio(props: IRadioProps) {
  return <input type='radio' {...props} />;
}

export default Radio;
