import React from 'react';
import cn from 'classnames';

import styles from './Section.scss';

export interface ISectionProps {
  header?: React.ReactNode;
  spacing?: 'top' | 'bottom' | true;
  isAlt?: boolean;
  children: React.ReactNode;
}

export const Section = ({
  header,
  isAlt,
  spacing,
  children
}: ISectionProps): JSX.Element => {
  const classNames = cn(
    styles.Section,
    { [styles.spaced_top]: spacing === 'top' || spacing === true },
    { [styles.spaced_bottom]: spacing === 'bottom' || spacing === true },
    { [styles.altBackground]: isAlt }
  );

  return (
    <div className={classNames}>
      <div className={styles.grid}>
        {header && <div className={styles.header}>{header}</div>}
        {children}
      </div>
    </div>
  );
};

export default Section;
