import { OptionHTMLAttributes } from 'react';

export type IOptionProps = OptionHTMLAttributes<HTMLOptionElement>;

export function Option(props: IOptionProps) {
  return <option {...props} />;
}

export default Option;
