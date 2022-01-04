import React from 'react';
import cn from 'clsx';

import Button from '../Button/Button';
import styles from './TextBlock.scss';

export interface ITextBlockProps {
  subject?: string;
  title?: string;
  callout?: string;
  ctaButton?: React.ReactElement<typeof Button>;
  ctaOnClick?: () => void;
  children?: React.ReactNode;
}

export const TextBlock = ({
  subject,
  title,
  callout,
  ctaButton,
  children
}: ITextBlockProps): JSX.Element => {
  const classNames = cn(styles.TextBlock);

  return (
    <div className={classNames}>
      {subject && <div className={styles.subject}>{subject}</div>}
      {title && <div className={styles.title}>{title}</div>}
      {callout && <div className={styles.callout}>{callout}</div>}      
      {children && <div className={styles.content}>{children}</div>}
      {ctaButton && <div className={styles.cta}>{ctaButton}</div>}
    </div>
  );
};

export default TextBlock;
