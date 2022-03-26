import React from 'react';
import cn from 'clsx';

import styles from './TextBlock.scss';

export interface ITextBlockProps {
  subject?: string;
  title?: string;
  children?: React.ReactNode;
}

export const TextBlock = ({ subject, title, children }: ITextBlockProps): JSX.Element => {
  const classNames = cn(styles.TextBlock);

  return (
    <div className={classNames}>
      {subject && <div className={styles.subject}>{subject}</div>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  );
};

export default TextBlock;
