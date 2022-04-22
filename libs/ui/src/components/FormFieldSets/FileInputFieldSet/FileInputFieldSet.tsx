import { useState, ChangeEvent } from 'react';
import { RiFileEditLine } from 'react-icons/ri';
import Input, { IInputProps } from '../../FormElements/Input/Input';
import { IBaseFormElementProps } from '../types';

import styles from './FileInputFieldSet.scss';

export type IFileInputFieldSetProps = IBaseFormElementProps<IInputProps>;

export function FileInputFieldSet({
  setValue,
  name,
  id,
  title,
  label,
  accept
}: IFileInputFieldSetProps) {
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setValue?.(file); // Save to form state for upload
    setFile(file.name); // Save to local state for display
  }

  const [file, setFile] = useState<string>();

  return (
    <div>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.container}>
        <div className={styles.inputContainer}>
          <Input
            type='file'
            name={name}
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
        <div className={styles.preview}>
          <RiFileEditLine className={styles.previewIcon} />
        </div>
      </div>
    </div>
  );
}

export default FileInputFieldSet;
