import { InputHTMLAttributes, useContext, useMemo, useCallback } from 'react';
import pick from 'lodash/pick';

import FormContext from './FormContext';
import { validate, constraintNames, IValidationConstraints } from './formFieldValidation';

export interface IMask {
  unmaskedValue: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

export type IFormFieldValue = InputHTMLAttributes<HTMLInputElement>['value'];

export interface IUseFormContextProps extends IValidationConstraints {
  value?: IFormFieldValue;
  name: string;
  disabled?: boolean;
  checked?: boolean;
  isSelectable?: boolean;
  isLoading?: boolean;
}

// @TODO
export function mask(val: IFormFieldValue): IMask {
  return {
    unmaskedValue: val,
    value: val
  };
}

export default (props: IUseFormContextProps) => {
  const { name, checked, disabled, isLoading, isSelectable } = props;
  const {
    getFieldValue,
    getFieldErrors,
    hasFieldBeenValid,
    updateField,
    hasFieldBeenInitialized,
    initializeField
  } = useContext(FormContext);
  const validationConstraints: IValidationConstraints = useMemo(
    () => pick<IValidationConstraints>(props, constraintNames),
    [props]
  );

  const setValue = useCallback(
    (val: IFormFieldValue, isInitialization = false) => {
      let valueForValidation;
      let valueForDisplay;

      if (isSelectable) {
        valueForValidation = val;
        valueForDisplay = val;
      } else {
        const masked = mask(val);
        valueForValidation = masked.unmaskedValue;
        valueForDisplay = masked.value;
      }

      const newErrors = validate(name, valueForValidation, validationConstraints);
      if (isInitialization) {
        initializeField(name, valueForDisplay, newErrors.length ? newErrors : undefined);
      } else {
        updateField(name, valueForDisplay, newErrors.length ? newErrors : undefined);
      }
    },
    [initializeField, isSelectable, name, checked, updateField, validationConstraints]
  );

  let isChecked;
  if (isSelectable) {
    const value = props.value;
    if (value) {
      isChecked = getFieldValue(name) === value;
    } else {
      isChecked = !!getFieldValue(name);
    }
  }

  const newValue: IFormFieldValue = isSelectable
    ? props.value
    : props.value || (getFieldValue(name) as IFormFieldValue);
  return {
    value: newValue,
    checked: isChecked,
    disabled: !!(disabled || isLoading),
    errors: hasFieldBeenValid(name) ? getFieldErrors(name) : undefined,
    isInitialized: hasFieldBeenInitialized(name),
    setValue
  };
};
