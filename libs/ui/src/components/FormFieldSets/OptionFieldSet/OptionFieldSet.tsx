import cn from 'clsx';

import Option, { IOptionProps } from '../../FormElements/Option/Option';

import styles from './OptionFieldSet.scss';

export function OptionFieldSet({ className, ...props }: IOptionProps) {
  const classNames = cn(className, styles.Option);
  return <Option {...props} className={classNames} />;
}

export default OptionFieldSet;
