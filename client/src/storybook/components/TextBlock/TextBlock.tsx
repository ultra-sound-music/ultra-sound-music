import React from 'react';
import cn from 'classnames';

import { Pill } from '../../components';
import { IButtonProps } from '../../types';
import styles from './TextBlock.scss';

export interface ITextBlockProps {
  subject?: string;
  title?: string;
  subTitle?: string;
  legend?: string;
  dataPoint?: string;
  callout?: string;
  ctaButton?: IButtonProps;
  isMuted?: boolean;
  ctaOnClick?: () => void;
  children?: React.ReactNode;
}

export const TextBlock = ({
  subject,
  title,
  subTitle,
  legend,
  dataPoint,
  callout,
  ctaButton,
  isMuted = false,
  children
}: ITextBlockProps): JSX.Element => {
  const classNames = cn(styles.TextBlock, { [styles.muted]: isMuted });

  return (
    <div className={classNames}>
      {subject && <div className={styles.subject}>{subject}</div>}
      {title && <div className={styles.title}>{title}</div>}
      {subTitle && <div className={styles.subTitle}>{subTitle}</div>}
      {legend && <div className={styles.legend}>{legend}</div>}
      {children && <div className={styles.content}>{children}</div>}
      {callout && (
        <div className={styles.callout}>
          <Pill isMuted={isMuted}>{callout}</Pill>
        </div>
      )}
      {dataPoint && <div className={styles.dataPoint}>{dataPoint}</div>}
      {ctaButton && <div className={styles.cta}>{ctaButton}</div>}
    </div>
  );
};

export default TextBlock;
