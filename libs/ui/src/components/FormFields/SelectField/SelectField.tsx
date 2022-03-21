import SelectFieldSet, {
  ISelectFieldSetProps
} from '../../FormFieldSets/SelectFieldSet/SelectFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

export type ISelectFieldProps = IFormFieldComponentProps<ISelectFieldSetProps>;

export function SelectField(props: ISelectFieldProps) {
  return null;
  // return <FormField {...props} component={Select} />;
}

export default SelectField;
