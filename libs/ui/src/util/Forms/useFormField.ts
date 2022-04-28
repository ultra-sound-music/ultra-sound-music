import { AllHTMLAttributes, ChangeEvent, FocusEvent, useEffect, useCallback } from 'react';

import { IFieldValue } from './FormContext';

export type IFormFieldValue<T = Element> = AllHTMLAttributes<T>['value'];

export interface UseFormFieldProps<T = Element> {
  isControlled?: boolean;
  isInitialized: boolean;
  isSelectable: boolean;
  isDisabled: boolean;
  defaultValue?: IFormFieldValue<T>;
  setValue(s: IFieldValue, b?: boolean): void;
}

export function isSelectableEvent(
  event: any,
  isSelectable: boolean
): event is ChangeEvent<HTMLInputElement> {
  return isSelectable;
}

export default function useFormField({
  isControlled = true,
  isSelectable,
  isInitialized,
  isDisabled,
  defaultValue,
  setValue
}: UseFormFieldProps) {
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (isSelectableEvent(event, isSelectable)) {
        setValue(event.target.checked ? event.target.value || true : undefined);
      } else {
        setValue(event.target.value);
      }
    },
    [setValue]
  );

  const onBlur = useCallback(
    (event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (isSelectableEvent(event, isSelectable)) {
        setValue(event.target.checked ? event.target.value || true : undefined);
      } else {
        setValue(event.target.value);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (isControlled && !isInitialized) {
      setValue(defaultValue, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, setValue]);

  useEffect(() => {
    if (isInitialized && isDisabled) {
      setValue(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isDisabled]);

  return {
    onChange: onChangeHandler,
    onBlur
  };
}
