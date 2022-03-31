import { RefObject } from 'react';
import ImageInputFieldSet, {
  IImageInputFieldSetProps
} from '../../FormFieldSets/ImageInputFieldSet/ImageInputFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type IImageInputFieldProps = Omit<
  IFormFieldComponentProps<IImageInputFieldSetProps>,
  'type'
> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function ImageInputField(props: IImageInputFieldProps) {
  return <FormField type='file' component={ImageInputFieldSet} {...props} />;
}

export default ImageInputField;
