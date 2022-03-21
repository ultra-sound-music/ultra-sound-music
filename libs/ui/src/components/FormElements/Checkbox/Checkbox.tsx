import { InputHTMLAttributes } from 'react';

export type ICheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function Checkbox(props: ICheckboxProps) {
  return <input type='checkbox' {...props} />;
}

export default Checkbox;
