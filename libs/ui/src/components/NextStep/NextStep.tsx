import cn from 'clsx';
import { RiCheckLine, RiCheckboxBlankCircleFill } from 'react-icons/ri';

import styles from './NextStep.scss';

export interface NextStepProps {
  number: number;
  status: 'open' | 'processing' | 'completed';
  onClick?(): void;
  children: string;
}

const mapStyles = {
  open: styles.number,
  processing: styles.processing,
  completed: styles.completed
};

export function NextStep({ number, status, children, onClick }: NextStepProps) {
  const className = cn(styles.NextStep, !!onClick && styles.clickable);
  const statusClassName = cn(styles.stepStatus, mapStyles[status]);

  let statusEl;
  if (status === 'open') {
    statusEl = number;
  } else if (status === 'processing') {
    statusEl = <RiCheckboxBlankCircleFill className={styles.circle} />;
  } else {
    statusEl = <RiCheckLine />;
  }

  return (
    <div className={className}>
      <div className={statusClassName}>{statusEl}</div>
      <div className={styles.text} onClick={onClick}>
        {children}
      </div>
    </div>
  );
}

export default NextStep;
