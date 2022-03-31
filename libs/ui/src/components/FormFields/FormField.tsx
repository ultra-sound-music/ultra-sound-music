import { ComponentType, useEffect, RefObject, useRef, HTMLAttributes } from 'react';

import useFormContext from '../../util/Forms/useFormContext';
import useFormField from '../../util/Forms/useFormField';

import { IBaseFormElementProps, IBaseFormFieldProps } from '../FormFieldSets/types';

export type IFormFieldElement<T> = HTMLAttributes<T> & {
  defaultValue: string; //@TODO add more
};

export type IFormFieldComponentProps<P> = IBaseFormElementProps<P>;

export type IFormFieldProps<P> = IBaseFormFieldProps<P> & {
  component: ComponentType<P>;
};

export function FormField<P>({ defaultValue, component: Component, ...props }: IFormFieldProps<P>) {
  const {
    innerRef,
    isControlled,
    name,
    selected: defaultSelected,
    disabled: defaultDisabled,
    isLoading
  } = props;

  const ref = useRef<HTMLElement>();

  const { value, selected, disabled, errors, isInitialized, setValue } = useFormContext({
    name,
    selected: defaultSelected,
    disabled: defaultDisabled,
    isLoading
  });

  const { onChange, onBlur } = useFormField({
    isControlled,
    isInitialized,
    defaultValue,
    setValue
  });

  const elRef = innerRef || ref;

  useEffect(() => {
    if (!elRef?.current) {
      return;
    }
  }, [elRef, errors]);

  props = Object.assign({}, props, {
    value,
    disabled,
    selected,
    onChange,
    onBlur,
    isInitialized,
    setValue,
    errors,
    innerRef: elRef as RefObject<HTMLElement>,
  });

  return <Component {...(props as P)} />;
}

export default FormField;
