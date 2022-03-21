import { ChangeEvent, SelectHTMLAttributes } from 'react';
import { Props } from 'react-select';
import isObject from 'lodash/isObject';
import cn from 'clsx';

import styles from './SelectFieldSet.scss';
import { IBaseFormElementProps } from '../types';

export type ISelectFieldSetProps = Omit<Props, 'options'> &
  IBaseFormElementProps<SelectHTMLAttributes<HTMLSelectElement>> & {
    options: ISelectValueObject[];
  };

export interface ISelectValueObject {
  label: string;
  value: string;
}

export function createFakeEvent(newValue: unknown): ChangeEvent<HTMLSelectElement> {
  const value = isObject(newValue) ? (newValue as ISelectValueObject)?.value : newValue;

  return {
    target: { value }
  } as ChangeEvent<HTMLSelectElement>;
}

export function Select({
  name,
  label,
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
  // function onChangeTransform(newValue: unknown, actionMeta: ActionMeta<unknown>) {
  //   const fakeEvent = createFakeEvent(newValue);
  //   onChange?.(fakeEvent);
  // }

  const valueObj = options?.find(({ value: val }) => val === value);
  const classNames = cn(className, styles.Select);

  return null;
  // <ReactSelect
  //   name={name}
  //   className={classNames}
  //   placeholder={label}
  //   value={valueObj}
  //   // onChange={onChangeTransform}
  //   options={options}
  //   classNamePrefix='c8'
  //   {...props}
  // />
}

export default Select;
