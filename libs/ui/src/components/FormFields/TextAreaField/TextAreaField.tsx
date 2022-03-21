import { RefObject } from 'react';
import TextAreaFieldSet, {
  ITextAreaFieldSetProps
} from '../../FormFieldSets/TextAreaFieldSet/TextAreaFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type ITextAreaFieldProps = IFormFieldComponentProps<ITextAreaFieldSetProps> & {
  innerRef?: RefObject<HTMLTextAreaElement>;
};

export function TextAreaField(props: ITextAreaFieldProps) {
  return <FormField {...props} component={TextAreaFieldSet} />;
}

export default TextAreaField;
