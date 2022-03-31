import React, { FormEvent, useContext, useEffect } from 'react';
import cn from 'clsx';
import get from 'lodash/get';
import { ApolloError } from '@apollo/client';

import Spinner from '../Spinner/Spinner';
import Link from '../Link/Link';
import { FormContext, IFormValues } from '../../util/Forms/FormContext';
import Button from '../Button/Button';
import FormSubmit from '../FormFields/FormSubmit/FormSubmit';
import InputField from '../FormFields/InputField/InputField';
import FileInputField from '../FormFields/FileInputField/FileInputField';
import ImageInputField from '../FormFields/ImageInputField/ImageInputField';
import PasswordField from '../FormFields/PasswordField/PasswordField';
import SearchField from '../FormFields/SearchField/SearchField';
import SelectField from '../FormFields/SelectField/SelectField';
import TextAreaField from '../FormFields/TextAreaField/TextAreaField';
import UploadField from '../FormFields/UploadField/UploadField';

import styles from './BaseForm.scss';

export type IOnSubmitHandler = (formValues: IFormValues, buttonName: string) => Promise<any> | void;

export interface IOnSubmitHandlers {
  [name: string]: IOnSubmitHandler;
}

export type IBaseFormOnSubmit = IOnSubmitHandler | IOnSubmitHandlers;

export interface IFormSubmitEvent extends FormEvent<HTMLFormElement> {
  nativeEvent: SubmitEvent;
}

export interface IBaseFormProps {
  className?: string;
  onSubmit?: IBaseFormOnSubmit;
  isLoading?: boolean;
  error?: ApolloError | Error;
  children: React.ReactNode;
}

const formFieldTypes = [
  InputField,
  FileInputField,
  ImageInputField,
  PasswordField,
  SearchField,
  SelectField,
  TextAreaField,
  UploadField
];

const formButtonTypes = [FormSubmit, Button];

export function BaseForm({
  onSubmit,
  className,
  isLoading = false,
  error,
  children,
  ...props
}: IBaseFormProps) {
  const { resetForm, getValues, setIsLoading } = useContext(FormContext);

  function onSubmitHandler(event: IFormSubmitEvent) {
    const buttonName = (event.nativeEvent.submitter as HTMLButtonElement)?.name;
    if (typeof onSubmit === 'function') {
      onSubmit?.(getValues(), buttonName)?.then(() => {
        resetForm();
      });
    } else {
      onSubmit?.[buttonName](getValues(), buttonName)?.then(() => {
        resetForm();
      });
    }

    event.preventDefault();
  }

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classNames = cn(styles.Form, className);
  const footerLinks: JSX.Element[] = [];
  const formButtons: JSX.Element[] = [];
  return (
    <form className={classNames} {...props} onSubmit={onSubmitHandler}>
      {React.Children.toArray(children)
        .map((child: React.ReactNode, index) => {
          const type = get(child, 'type');
          if (formFieldTypes.some((fieldType) => fieldType === type)) {
            return (
              <div key={index} className={styles.formField}>
                {child}
              </div>
            );
          }

          if (formButtonTypes.some((buttonType) => buttonType === type)) {
            formButtons.push(child as JSX.Element);
            return false;
          }

          if (type === Link) {
            footerLinks.push(child as JSX.Element);
            return false;
          }

          return child;
        })
        .filter((el) => el)}

      {!!error && <div className={styles.error}>{error?.message}</div>}
      {!!formButtons.length && <div className={styles.buttons}>{formButtons}</div>}
      {!!footerLinks.length && <div className={styles.footerLinks}>{footerLinks}</div>}
      {isLoading && <Spinner cover='fixed' />}
    </form>
  );
}

export default BaseForm;
