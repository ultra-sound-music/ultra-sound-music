import cn from 'clsx';

import { createArray } from '@usm/util-utils';

import Pill from '../Pill/Pill';

import styles from './PillMeter.scss';

export interface IPillMeterProps {
  label?: string;
  total: number;
  value: number;
}

export function PillMeter({ label, total, value }: IPillMeterProps) {
  return (
    <div className={styles.PillMeter}>
      <Pill label={label} shrink={true}>
        <div className={styles.markers}>
          {createArray(total).map((val: number, index: number) => {
            const active = !!(index < value);
            return (
              <div
                className={cn(styles.marker, active && styles.activeMarker)}
              ></div>
            );
          })}
        </div>
      </Pill>
    </div>
  );
}

export default PillMeter;
