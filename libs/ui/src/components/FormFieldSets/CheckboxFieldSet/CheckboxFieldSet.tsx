import { RefObject } from 'react';
import cn from 'clsx';

import Input, { IInputProps } from '../../FormElements/Input/Input';
import { IBaseFormElementProps } from '../types';

import styles from './CheckboxFieldSet.scss';

export type ICheckboxFieldSetProps = Omit<IBaseFormElementProps<IInputProps>, 'type'> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function CheckboxFieldSet({ label, error, errors, ...props }: ICheckboxFieldSetProps) {
  error = error || errors?.[0]; // @TODO

  return (
    <div className={styles.Checkbox}>
      {label && <label className={styles.label}>{label}</label>}
      <Input type='checkbox' className={styles.checkbox} {...props} />
      {error && <div className={cn(styles.error, styles.show)}>{error}</div>}
    </div>
  );
}

export default CheckboxFieldSet;
