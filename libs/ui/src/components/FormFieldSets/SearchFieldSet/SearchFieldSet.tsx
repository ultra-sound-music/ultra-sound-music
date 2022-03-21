import { RefObject } from 'react';
import Input, { IInputProps } from '../../FormElements/Input/Input';
import { IBaseFormElementProps } from '../types';

export type ISearchFieldSetProps = Omit<IBaseFormElementProps<IInputProps>, 'type'> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function SearchFieldSet({ ...props }: ISearchFieldSetProps) {
  return <Input type='search' {...props} />;
}

export default SearchFieldSet;
