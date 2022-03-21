import { ComponentType, useEffect, RefObject, useRef, HTMLAttributes } from 'react';
import ReactTooltip from 'react-tooltip';

import useFormContext from '../../util/Forms/useFormContext';
import useFormField from '../../util/Forms/useFormField';
import Tooltip from '../Tooltip/Tooltip';
import { getFormFieldTooltip } from '../../util/Forms/FormFieldTooltip';

import styles from './FormField.scss';
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
  const tipData = getFormFieldTooltip({
    errors: errors
  });

  useEffect(() => {
    if (!elRef?.current) {
      return;
    }

    if (errors) {
      ReactTooltip.show(elRef.current);
    } else if (!errors) {
      ReactTooltip.hide(elRef.current);
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
    'data-for': props.name,
    'data-tip': ''
  });

  return (
    <>
      <Component {...(props as P)} />
      <Tooltip
        className={styles.tooltip}
        id={props.name}
        effect='solid'
        place='left'
        html={true}
        scrollHide={false}
        event='fooshnikens'
        getContent={() => tipData}
      ></Tooltip>
    </>
  );
}

export default FormField;
