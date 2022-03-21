import { RiSearchLine } from 'react-icons/ri';

import InputFieldSet, {
  IInputFieldSetProps
} from '../../FormFieldSets/InputFieldSet/InputFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type ISearchFieldProps = IFormFieldComponentProps<IInputFieldSetProps>;

export function SearchField({ ...props }: ISearchFieldProps) {
  return (
    <FormField type='search' component={InputFieldSet} leadingIcon={<RiSearchLine />} {...props} />
  );
}

export default SearchField;
