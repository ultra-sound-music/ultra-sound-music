import { createContext, useState, useCallback, useRef, Dispatch, SetStateAction } from 'react';
import isEqual from 'lodash/isEqual';

export type IFieldName = string;
export type IFieldValue = React.InputHTMLAttributes<HTMLInputElement>['value'] | ArrayBuffer | Blob;
export type IFieldSetter = (fname: string, fval: IFieldName) => void;

export interface IFormValues {
  [n: string]: IFieldValue;
}

export interface IFormErrors {
  [n: string]: string[] | undefined;
}

export interface IFormErroredFields {
  [n: string]: true;
}

export interface IFormContext {
  resetForm(): void;
  setIsLoading(isLoading: boolean): void;
  isValid(): boolean;
  getValues(): IFormValues;
  hasFieldBeenValid(n: IFieldName): boolean;
  hasFieldBeenInitialized(n: IFieldName): boolean;
  getFieldValue(n: IFieldName): IFieldValue;
  getFieldErrors(n: IFieldName): string[] | undefined;
  initializeField(n: IFieldName, v: IFieldValue, e?: string[]): void;
  updateField(n: IFieldName, v: IFieldValue, e?: string[]): void;
}

export interface IFormContextProviderProps {
  onChange?: (fieldName: IFieldName, fieldValue: IFieldValue, setValue: IFieldSetter) => void;
  children: React.ReactNode;
}

export interface IUpdateFieldProps {
  setValues: Dispatch<SetStateAction<IFormValues>>;
  setErrors: Dispatch<SetStateAction<IFormErrors>>;
  setFieldsThatValidated: Dispatch<SetStateAction<IFormErroredFields>>;
  fieldsThatValidated: IFormErroredFields;
  errors: IFormErrors;
  fieldName: IFieldName;
  fieldValue: IFieldValue;
  fieldErrors: string[];
  onChange?: (fieldName: string, fieldValue: IFieldValue, setValue: IFieldSetter) => void;
}

export function processUpdateField({
  setValues,
  setFieldsThatValidated,
  setErrors,
  fieldsThatValidated,
  errors,
  fieldName,
  fieldValue,
  fieldErrors,
  onChange
}: IUpdateFieldProps) {
  function fieldSetter(fname: string, fval: IFieldName): void {
    if (fieldName === fname) {
      return;
    }

    setValues((prev) => ({
      ...prev,
      [fname]: fval
    }));
  }

  if (!fieldErrors && !fieldsThatValidated[fieldName]) {
    setFieldsThatValidated((prev) => ({ ...prev, [fieldName]: true }));
  }

  const prevErrors = errors[fieldName];
  if (!isEqual(fieldErrors, prevErrors)) {
    setErrors((prev) => ({ ...prev, [fieldName]: fieldErrors }));
  }

  setValues((prev) => {
    onChange?.(fieldName, fieldValue, fieldSetter);

    return {
      ...prev,
      [fieldName]: fieldValue
    };
  });
}

export const FormContext = createContext({} as IFormContext);
export default FormContext;

export function FormContextProvider({ onChange, children }: IFormContextProviderProps) {
  const ref = useRef<string[]>([]);
  const [values, setValues] = useState<IFormValues>({});
  const [errors, setErrors] = useState<IFormErrors>({});
  const [, setIsLoading] = useState(true);
  const [fieldsThatValidated, setFieldsThatValidated] = useState<IFormErroredFields>({});

  const initializeField = useCallback(
    (fieldName: string, fieldValue: string, fieldErrors: string[]) => {
      if (ref.current.includes(fieldName)) {
        return;
      }

      ref.current.push(fieldName);
      return processUpdateField({
        setValues,
        setFieldsThatValidated,
        setErrors,
        fieldsThatValidated,
        errors,
        fieldName,
        fieldValue,
        fieldErrors,
        onChange
      });
    },
    [errors, fieldsThatValidated, onChange]
  );

  const updateField = useCallback(
    (fieldName: string, fieldValue: string, fieldErrors: string[]) => {
      if (!ref.current.includes(fieldName)) {
        ref.current.push(fieldName);
      }

      return processUpdateField({
        setValues,
        setFieldsThatValidated,
        setErrors,
        fieldsThatValidated,
        errors,
        fieldName,
        fieldValue,
        fieldErrors,
        onChange
      });
    },
    [errors, fieldsThatValidated, onChange]
  );

  const formContext: IFormContext = {
    resetForm: () => {
      setValues({});
      setErrors({});
      setIsLoading(true);
      setFieldsThatValidated({});
    },
    setIsLoading,
    isValid: () => Object.values(errors).every((errs) => !errs?.length),
    getValues: () => values,
    hasFieldBeenValid: (fieldName) => !!fieldsThatValidated[fieldName],
    hasFieldBeenInitialized: (fieldName) => !!ref.current.includes(fieldName),
    getFieldValue: (fieldName) => values?.[fieldName] ?? '',
    getFieldErrors: (fieldName) => errors?.[fieldName],
    initializeField,
    updateField
  };

  return <FormContext.Provider value={formContext}>{children}</FormContext.Provider>;
}
