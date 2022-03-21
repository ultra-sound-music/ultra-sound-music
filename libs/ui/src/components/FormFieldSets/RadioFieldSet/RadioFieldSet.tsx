import { RefObject } from 'react';
import Input, { IInputProps } from '../../FormElements/Input/Input';
import { IBaseFormElementProps } from '../types';

export type IRadioFieldSetProps = Omit<IBaseFormElementProps<IInputProps>, 'type'> & {
  innerRef?: RefObject<HTMLInputElement>;
};

export function Radio(props: IRadioFieldSetProps) {
  return <Input type='radio' {...props} />;
}

export default Radio;
