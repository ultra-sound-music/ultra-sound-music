import { InputHTMLAttributes } from 'react';

export type ISearchProps = InputHTMLAttributes<HTMLInputElement>;

export function Search(props: ISearchProps) {
  return <input type='search' {...props} />;
}
