import { RefObject, ReactNode } from 'react';

import cn from 'clsx';

import Input, { IInputProps } from '../../FormElements/Input/Input';
import useFormFieldLabel from '../../../util/Forms/useFormFieldLabel';
import { IBaseFormElementProps } from '../types';

import styles from './InputFieldSet.scss';
import { resetCaches } from '@apollo/client';

export type IInputFieldSetProps = IBaseFormElementProps<IInputProps> & {
  withLabel?: boolean;
  leadingIcon?: ReactNode;
  icon?: ReactNode;
  context?: ReactNode;
};

export function InputFieldSet({
  type,
  title,
  value,
  id,
  className,

  // custom props
  label: defaultLabel = '',
  error,
  errors,
  withLabel = true,
  leadingIcon,
  icon,
  context,
  innerRef,
  showIcon,
  setValue,
  isInitialized,
  isLoading,
  isControlled,
  toggleVisibility,
  toggleExpand,
  ...rest
}: IInputFieldSetProps) {
  const { label, placeholder } = useFormFieldLabel({ value, label: defaultLabel });

  const hasValue = !!value;

  if (!showIcon) {
    showIcon = () => !!icon;
  }

  const classNames = cn(
    styles.InputFieldSet,
    hasValue && styles.hasValue,
    leadingIcon && styles.withLeadingIcon,
    withLabel && styles.withLabel,
    className
  );

  return (
    <div className={classNames}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.inputContainer}>
        <div className={styles.leadingIcon}>{leadingIcon}</div>
        <Input
          type={type}
          className={styles.input}
          id={id}
          placeholder={placeholder}
          value={value}
          innerRef={innerRef as RefObject<HTMLInputElement>}
          {...rest}
        />
        {showIcon(value as string, errors) && <div className={styles.icon}>{icon}</div>}
        {context && <div className={styles.context}>{context}</div>}
        {withLabel && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    </div>
  );
}

export default InputFieldSet;
