import { ChangeEvent, SelectHTMLAttributes } from 'react';
import ReactSelect, { Props, ActionMeta } from 'react-select';
import isObject from 'lodash/isObject';
import cn from 'clsx';

import styles from './SelectFieldSet.scss';
import { IBaseFormElementProps } from '../types';

export interface ISelectFieldSetOption {
  label: string;
  value: string;
}

export type ISelectFieldSetSpecificProps = {
  options?: ISelectFieldSetOption[];
};

export type ISelectFieldSetProps = Omit<Props, 'options' | 'onChange'> &
  IBaseFormElementProps<SelectHTMLAttributes<HTMLSelectElement>> &
  ISelectFieldSetSpecificProps;

export function createFakeEvent(newValue: unknown): ChangeEvent<HTMLSelectElement> {
  const value = isObject(newValue) ? (newValue as ISelectFieldSetOption)?.value : newValue;

  return {
    target: { value }
  } as ChangeEvent<HTMLSelectElement>;
}

export function SelectFieldSet({
  name,
  label,
  title,
  defaultValue,
  className,
  options,
  value,
  selected, // ignore
  errors, // ignore
  innerRef, // ignore
  setValue,
  onBlur, // ignore
  onChange,
  ...props
}: ISelectFieldSetProps) {
  function onChangeTransform(newValue: unknown, actionMeta: ActionMeta<unknown>) {
    const fakeEvent = createFakeEvent(newValue);
    onChange?.(fakeEvent);
  }

  const valueObj = options?.find(({ value: val }) => val === value);
  const classNames = cn(className, styles.Select);

  return (
    <div>
      {title && <div className={styles.title}>{title}</div>}
      <ReactSelect
        name={name}
        className={classNames}
        placeholder={label}
        value={valueObj}
        options={options}
        classNamePrefix='c8'
        onChange={onChangeTransform}
        {...props}
      />
    </div>
  );
}

export default SelectFieldSet;
