import cn from 'clsx';
import styles from './Spinner.scss';

export interface ISpinnerProps {
  cover?: 'relative' | 'fixed';
  isFullSize?: boolean;
}

export function Spinner({ cover, isFullSize }: ISpinnerProps): JSX.Element {
  const classNames = cn(styles.Spinner, isFullSize && styles.fullSize, {
    [styles[`cover_${cover}`]]: cover
  });
  return <div className={classNames}></div>;
}

export default Spinner;
