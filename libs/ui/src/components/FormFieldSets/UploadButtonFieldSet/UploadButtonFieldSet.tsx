import { ReactNode } from 'react';

import Button, { IButtonProps } from '../../Button/Button';
import { IBaseFormElementProps } from '../types';

import styles from './UploadButtonFieldSet.scss';

export type IUploadButtonFieldSetProps = IBaseFormElementProps<Omit<IButtonProps, 'size'>> & {
  image?: ReactNode;
  title?: string;
  label?: ReactNode;
};

export function UploadButtonFieldSet({
  label,
  size,
  title,
  shape,
  isInitialized, // Ignored
  innerRef, // Ignored
  setValue,
  ...props
}: IUploadButtonFieldSetProps) {
  function onclick() {}

  return (
    <div className={styles.UploadButtonFieldSet}>
      {title && <div className={styles.title}>{title}</div>}
      <Button {...props} type='secondary' onClick={onClick}>
        {label}
      </Button>
    </div>
  );
}

export default UploadButtonFieldSet;
