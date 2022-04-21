import { useContext, ReactNode, useEffect } from 'react';

import Button from '../../Button/Button';
import { FormContext } from '../../../util/Forms/FormContext';

export interface IFormSubmitProps {
  name?: string;
  value?: string;
  isFullWidth?: boolean;
  isFormDisabled?: boolean;
  children?: ReactNode;
}

export function FormSubmit({
  name,
  value,
  isFullWidth,
  isFormDisabled,
  children
}: IFormSubmitProps) {
  const { isValid, updateField } = useContext(FormContext);

  function onClick() {
    updateField(name as string, value);
  }

  const props = {
    isFormSubmit: true,
    isFullWidth,
    isDisabled: !isValid() || isFormDisabled,
    ...(name && { name, onClick })
  };

  return <Button {...props}>{children || 'submit'}</Button>;
}

export default FormSubmit;
