import { RefObject } from 'react';
import FileInputFieldSet, {
  IFileInputFieldSetProps
} from '../../FormFieldSets/FileInputFieldSet/FileInputFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type IFileInputFieldProps = Omit<
  IFormFieldComponentProps<IFileInputFieldSetProps>,
  'type'
> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function FileInputField(props: IFileInputFieldProps) {
  return <FormField type='file' component={FileInputFieldSet} {...props} />;
}

export default FileInputField;
