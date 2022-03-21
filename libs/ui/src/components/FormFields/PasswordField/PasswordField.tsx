import { useState } from 'react';

import { RiEyeOffLine, RiEyeLine } from 'react-icons/ri';

import InputFieldSet, {
  IInputFieldSetProps
} from '../../FormFieldSets/InputFieldSet/InputFieldSet';
import FormField, { IFormFieldComponentProps } from '../FormField';

import styles from '../FormField.scss';

export type IPasswordFieldProps = Omit<IFormFieldComponentProps<IInputFieldSetProps>, 'type'>;

export function PasswordField(props: IPasswordFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  function onRevealClick() {
    setIsRevealed(!isRevealed);
  }

  const Icon = isRevealed ? RiEyeLine : RiEyeOffLine;
  const icon = <Icon className={styles.clickable} onClick={onRevealClick} />;
  const type = isRevealed ? 'text' : 'password';
  return <FormField component={InputFieldSet} type={type} icon={icon} {...props} />;
}

export default PasswordField;
