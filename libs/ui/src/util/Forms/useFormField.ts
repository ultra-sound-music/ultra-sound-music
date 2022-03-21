import { AllHTMLAttributes, ChangeEvent, FocusEvent, useEffect, useCallback } from 'react';

export type IFormFieldValue<T = Element> = AllHTMLAttributes<T>['value'];

export interface IUseFormFieldProps<T = Element> {
  isControlled?: boolean;
  isInitialized: boolean;
  defaultValue?: IFormFieldValue<T>;
  setValue(s: IFormFieldValue<T>, b?: boolean): void;
}

export default function useFormField({
  isControlled = true,
  isInitialized,
  defaultValue,
  setValue
}: IUseFormFieldProps) {
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValue(event.target.value);
    },
    [setValue]
  );

  const onBlur = useCallback(
    (event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValue(event.target.value);
    },
    [setValue]
  );

  useEffect(() => {
    if (isControlled && !isInitialized) {
      setValue(defaultValue, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, setValue]);

  return {
    onChange: onChangeHandler,
    onBlur
  };
}
