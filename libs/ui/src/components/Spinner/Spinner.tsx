import cn from 'clsx';
import styles from './Spinner.scss';

export interface ISpinnerProps {
  cover?: 'relative' | 'fixed';
}

export function Spinner ({ cover }: ISpinnerProps): JSX.Element {
  const classNames = cn(styles.Spinner, { [styles[`cover_${cover}`]]: cover });
  return <div className={classNames}></div>;
};

export default Spinner;
