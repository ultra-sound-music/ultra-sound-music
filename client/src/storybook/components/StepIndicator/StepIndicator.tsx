import React, { useCallback } from 'react';
import cn from 'classnames';

import styles from './StepIndicator.scss';

export interface IStepIndicator {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({
  currentStep,
  totalSteps
}: IStepIndicator): JSX.Element => {
  const getSteps = useCallback(
    (totalSteps) => {
      return Array(totalSteps)
        .fill(null)
        .map((v, i) => i + 1);
    },
    [totalSteps]
  );

  const steps = getSteps(totalSteps);
  const renderStep = useCallback(
    (step) => {
      const stepClassNames = cn(styles.step, {
        [styles.current]: step === currentStep
      });
      return <li className={stepClassNames}>{step}</li>;
    },
    [steps, currentStep]
  );

  return (
    <div className={styles.StepIndicator}>
      <ul className={styles.stepsList}>{steps.map(renderStep)}</ul>
    </div>
  );
};

export default StepIndicator;
