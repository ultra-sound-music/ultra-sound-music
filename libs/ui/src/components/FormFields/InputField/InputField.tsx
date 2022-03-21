import { RefObject } from 'react';
import InputFieldSet, {
  IInputFieldSetProps
} from '../../FormFieldSets/InputFieldSet/InputFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type IInputFieldProps = IFormFieldComponentProps<IInputFieldSetProps> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function InputField(props: IInputFieldProps) {
  return <FormField component={InputFieldSet} {...props} />;
}

export default InputField;
