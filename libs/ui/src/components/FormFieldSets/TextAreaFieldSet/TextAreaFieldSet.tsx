import { RefObject, TextareaHTMLAttributes } from 'react';
import useFormFieldLabel from '../../../util/Forms/useFormFieldLabel';
import { TextArea } from '../../FormElements/TextArea/TextArea';
import { IBaseFormElementProps } from '../types';

import styles from './TextAreaFieldSet.scss';

export type ITextAreaFieldSetProps = IBaseFormElementProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>
> & {
  innerRef?: RefObject<HTMLTextAreaElement>;
};

export function TextAreaFieldSet({
  type,
  title,
  value,
  id,
  className,

  // custom props
  label: defaultLabel = '',
  error,
  errors,
  innerRef,
  showIcon,
  setValue,
  isLoading,
  isInitialized,
  isControlled,
  toggleVisibility,
  toggleExpand,
  ...props
}: ITextAreaFieldSetProps) {
  const { placeholder, label } = useFormFieldLabel({ value, label: defaultLabel });

  return (
    <div className={styles.TextArea}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.textAreaContainer}>
        <TextArea
          className={styles.textarea}
          placeholder={placeholder}
          innerRef={innerRef}
          value={value}
          {...props}
        />
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    </div>
  );
}

export default TextAreaFieldSet;
