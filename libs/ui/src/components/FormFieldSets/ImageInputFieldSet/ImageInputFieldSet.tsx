import { useState, MouseEvent, ChangeEvent } from 'react';
import { RiFileAddLine } from 'react-icons/ri';

import Input, { IInputProps } from '../../FormElements/Input/Input';
import { IBaseFormElementProps } from '../types';

import styles from './ImageInputFieldSet.scss';

export type IImageInputFieldSetProps = IBaseFormElementProps<IInputProps>;

export function ImageInputFieldSet({ id, title, label, accept }: IImageInputFieldSetProps) {
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImage(URL.createObjectURL(file));
  }

  const [image, setImage] = useState<string>();

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
            {image ? (
              <img src={image} className={styles.preview} />
            ) : (
              <RiFileAddLine className={styles.imageIcon} />
            )}
          </label>
        )}
      </div>
    </div>
  );
}

export default ImageInputFieldSet;
