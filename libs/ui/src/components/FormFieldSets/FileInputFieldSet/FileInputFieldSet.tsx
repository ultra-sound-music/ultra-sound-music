import { useState, ChangeEvent } from 'react';
import Input, { IInputProps } from '../../FormElements/Input/Input';
import { IBaseFormElementProps } from '../types';

import styles from './FileInputFieldSet.scss';

export type IFileInputFieldSetProps = IBaseFormElementProps<IInputProps>;

export function FileInputFieldSet({ id, title, label, accept }: IFileInputFieldSetProps) {
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFile(file.name);
  }

  const [file, setFile] = useState<string>();

  return (
    <div>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.inputContainer}>
        <Input
          type='file'
          id={id}
          aria-label='File browser'
          accept={accept}
          className={styles.input}
          onChange={onChange}
        />
        {label && (
          <label htmlFor={id} className={styles.label}>
            <div className={styles.button}>Browse</div>
            {file || label}
          </label>
        )}
      </div>
    </div>
  );
}

export default FileInputFieldSet;
