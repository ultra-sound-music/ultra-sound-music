import { useState, ChangeEvent } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import InputFieldSet, { IInputFieldSetProps } from '../InputFieldSet/InputFieldSet';
import Button from '../../Button/Button';

import styles from './InputListFieldSet.scss';

export type IInputListFieldSetProps = IInputFieldSetProps;

const separator = ' %% ';

export default function InputListFieldSet({
  name,
  title,
  label,
  value = '',
  setValue
}: IInputListFieldSetProps) {
  const [inputValue, setInputValue] = useState<string>();
  console.log(inputValue);
  function addItem() {
    const list = (value + '').split(separator);
    if (!inputValue || list.includes(inputValue)) {
      return;
    }

    valueList.push(inputValue);
    setValue?.(valueList.join(separator));
    setInputValue('');
  }

  function removeItem(index: number) {
    valueList.splice(index, 1);
    setValue?.(valueList.join(separator));
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value?.trim());
  }

  const valueList = typeof value === 'string' ? value.split(separator).filter((i) => i) : [];
  return (
    <div className={styles.InputListFieldSet}>
      <div className={styles.fieldContainer}>
        <InputFieldSet
          name={name}
          title={title}
          label={label}
          value={inputValue}
          onChange={onChange}
        />
        <Button onClick={addItem}>add</Button>
      </div>
      {!!valueList.length && (
        <ul className={styles.list}>
          {valueList.map((item: string, index: number) => (
            <li className={styles.item}>
              {item}{' '}
              <span
                onClick={() => removeItem(index)}
                data-val={index}
                className={styles.removeItem}
              >
                <RiCloseLine />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
