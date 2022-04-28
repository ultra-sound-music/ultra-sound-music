import { ComponentType, RefObject, useRef, HTMLAttributes } from 'react';
import isNil from 'lodash/isNil';

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
    checked: defaultChecked,
    disabled: defaultDisabled,
    isLoading
  } = props;

  const ref = useRef<HTMLElement>();
  const isSelectable = !isNil(defaultChecked);

  const { value, checked, disabled, errors, isInitialized, setValue } = useFormContext({
    name,
    checked: defaultChecked,
    isSelectable,
    disabled: defaultDisabled,
    isLoading
  });

  const { onChange, onBlur } = useFormField({
    isControlled,
    isInitialized,
    isSelectable,
    isDisabled: disabled,
    defaultValue,
    setValue
  });

  const elRef = innerRef || ref;
  props = Object.assign({}, props, {
    initialValue: defaultValue,
    id: props.name,
    value,
    disabled,
    checked,
    onChange,
    onBlur,
    isInitialized,
    setValue,
    errors,
    innerRef: elRef as RefObject<HTMLElement>,
    'data-for': props.name,
    'data-tip': ''
  });

  return <Component {...(props as P)} />;
}

export default FormField;
