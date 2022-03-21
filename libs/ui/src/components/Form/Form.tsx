import { FormContextProvider, IFormContextProviderProps } from '../../util/Forms/FormContext';

import BaseForm, { IBaseFormProps } from './BaseForm';

export type IFormProps = IBaseFormProps & IFormContextProviderProps;

export function Form({ onChange, ...props }: IFormProps) {
  return (
    <FormContextProvider onChange={onChange}>
      <BaseForm {...props} />
    </FormContextProvider>
  );
}

export default Form;
