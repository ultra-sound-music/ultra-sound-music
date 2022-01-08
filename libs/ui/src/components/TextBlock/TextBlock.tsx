import React from 'react';
import cn from 'clsx';

import styles from './TextBlock.scss';

export interface ITextBlockProps {
  subject?: string;
  title?: string;
  children?: React.ReactNode;
}

export const TextBlock = ({
  subject,
  title,
  children
}: ITextBlockProps): JSX.Element => {
  const classNames = cn(styles.TextBlock);

  return (
    <div className={classNames}>
      {subject && <div className={styles.subject}>{subject}</div>}
      {title && <div className={styles.title}>{title}</div>}
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export default TextBlock;
