import NextStep, { NextStepProps } from '../../NextStep/NextStep';

import styles from './BidRedemptionStatus.scss';

export interface BidRedemptionStatusProps {
  items: NextStepProps[];
}

export function BidRedemptionStatus({ items }: BidRedemptionStatusProps) {
  const allDone = items.every((step) => step.status === 'completed');

  return (
    <div className={styles.BidRedemptionStatus}>
      <div className={styles.title}>{allDone ? 'Completed:' : 'Next:'}</div>
      {items.map((nextStep) => (
        <NextStep {...nextStep} />
      ))}
    </div>
  );
}

export default BidRedemptionStatus;
