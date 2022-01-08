import { useState, useCallback, ReactNode } from 'react';
import cn from 'classnames';
import styles from './Accordian.scss';

export interface IAccordianProps {
  term: ReactNode;
  details: ReactNode;
}

export const Accordian = ({ term, details }: IAccordianProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const state = isOpen ? 'open' : 'closed';

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const classNames = cn(styles.Accordian, styles[state]);

  return (
    <div className={classNames} onClick={toggle}>
      <div className={styles.title}>{term}</div>
      <div className={styles.content}>{details}</div>
    </div>
  );
};

export default Accordian;
