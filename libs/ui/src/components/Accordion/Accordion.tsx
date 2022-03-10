import { useState, useCallback, ReactNode } from 'react';
import cn from 'clsx';
import styles from './Accordion.scss';

export interface IAccordionProps {
  term: ReactNode;
  details: ReactNode;
}

export const Accordion = ({ term, details }: IAccordionProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const state = isOpen ? 'open' : 'closed';

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const classNames = cn(styles.Accordion, styles[state]);

  return (
    <div className={classNames} onClick={toggle}>
      <div className={styles.title}>{term}</div>
      <div className={styles.content}>{details}</div>
    </div>
  );
};

export default Accordion;
