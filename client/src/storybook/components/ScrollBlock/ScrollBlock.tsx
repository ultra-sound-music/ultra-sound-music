import React from 'react';
import cn from 'classnames';
import styles from './ScrollBlock.scss';

export interface IScrollBlockSectionProps {
  isMuted?: boolean;
  children: JSX.Element;
}

export interface IScrollBlockProps {
  children: JSX.Element[];
}

export const ScrollBlockSection = ({
  isMuted = false,
  children
}: IScrollBlockSectionProps): JSX.Element => {
  const classNames = cn(styles.section, { [styles.muted]: isMuted });
  const ch = React.Children.toArray(children);
  return (
    <div className={classNames}>
      {ch[0] && <div className={styles.sectionBlock}>{ch[0]}</div>}
      {ch[1] && <div className={styles.sectionBlock}>{ch[1]}</div>}
    </div>
  );
};

export const ScrollBlock = ({ children }: IScrollBlockProps): JSX.Element => {
  return (
    <div className={styles.ScrollBlock}>
      {React.Children.map(children, (child, i) => (
        <ScrollBlockSection key={i} isMuted={child.props['data-isMuted']}>
          {child.props.children}
        </ScrollBlockSection>
      ))}
    </div>
  );
};

export default ScrollBlock;
