import { ReactNode } from 'react';
import cn from 'clsx';

import styles from './Section.scss';

export interface ISectionProps {
  className?: string;
  children: ReactNode;
}

export function Section({ className, children }: ISectionProps) {
  const classNames = cn(styles.Section, className);
  return (
    <div className={classNames}>{children}</div>
  );
}

export default Section;
