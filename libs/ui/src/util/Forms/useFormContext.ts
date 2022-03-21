import { InputHTMLAttributes, useContext, useMemo, useCallback } from 'react';
import pick from 'lodash/pick';
import isNil from 'lodash/isNil';

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
  selected?: boolean;
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
  const { name, selected, disabled, isLoading } = props;
  const {
    getFieldValue,
    getFieldErrors,
    hasFieldBeenValid,
    updateField,
    hasFieldBeenInitialized,
    initializeField
  } = useContext(FormContext);
  const isSelectable = !isNil(selected);

  const validationConstraints: IValidationConstraints = useMemo(
    () => pick<IValidationConstraints>(props, constraintNames),
    [props]
  );

  const setValue = useCallback(
    (val: IFormFieldValue, isIntialization = false) => {
      let valueForValidation;
      let valueForDisplay;

      if (isSelectable) {
        valueForValidation = valueForDisplay = selected ? val : undefined;
      } else {
        const masked = mask(val);
        valueForValidation = masked.unmaskedValue;
        valueForDisplay = masked.value;
      }

      const newErrors = validate(name, valueForValidation, validationConstraints);
      if (isIntialization) {
        initializeField(name, valueForDisplay, newErrors.length ? newErrors : undefined);
      } else {
        updateField(name, valueForDisplay, newErrors.length ? newErrors : undefined);
      }
    },
    [initializeField, isSelectable, name, selected, updateField, validationConstraints]
  );

  return {
    value: props.value || getFieldValue(name),
    selected: isSelectable ? getFieldValue(name) === props.value : undefined,
    disabled: disabled || isLoading,
    errors: hasFieldBeenValid(name) ? getFieldErrors(name) : undefined,
    isInitialized: hasFieldBeenInitialized(name),
    setValue
  };
};
