import { RiUploadLine } from 'react-icons/ri';

import UploadButtonFieldSet, {
  IUploadButtonFieldSetProps
} from '../../FormFieldSets/UploadButtonFieldSet/UploadButtonFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type IUploadFieldProps = IFormFieldComponentProps<IUploadButtonFieldSetProps>;

export function UploadField({ name, label, title }: IUploadFieldProps) {
  return (
    <FormField
      name={name}
      label={label}
      title={title}
      image={<RiUploadLine />}
      component={UploadButtonFieldSet}
    />
  );
}

export default UploadField;
