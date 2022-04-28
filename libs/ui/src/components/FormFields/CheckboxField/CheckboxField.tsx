import { RefObject } from 'react';
import CheckboxFieldSet, {
  ICheckboxFieldSetProps
} from '../../FormFieldSets/CheckboxFieldSet/CheckboxFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type ICheckboxFieldProps = IFormFieldComponentProps<ICheckboxFieldSetProps> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function CheckboxField(props: ICheckboxFieldProps) {
  return <FormField component={CheckboxFieldSet} checked={props.selected || false} {...props} />;
}

export default CheckboxField;
