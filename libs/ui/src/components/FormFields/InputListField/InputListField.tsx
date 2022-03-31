import { RefObject } from 'react';
import InputListFieldSet, {
  IInputListFieldSetProps
} from '../../FormFieldSets/InputListFieldSet/InputListFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type IInputListFieldProps = IFormFieldComponentProps<IInputListFieldSetProps> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function InputListField(props: IInputListFieldProps) {
  return <FormField component={InputListFieldSet} {...props} />;
}

export default InputListField;
