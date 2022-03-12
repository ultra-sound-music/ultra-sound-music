import Lottie from 'react-lottie-player';

import meter1 from '@usm/assets/lottie/animated_meters/meter_1.json';
import meter2 from '@usm/assets/lottie/animated_meters/meter_2.json';
import meter3 from '@usm/assets/lottie/animated_meters/meter_3.json';

import styles from './AnimatedMeter.scss';

export interface IAnimatedMeterProps {
  play?: boolean;
  meter?: number;
  label?: string;
  value: [number, number];
}

const meters = [meter1, meter2, meter3];
export function AnimatedMeter({
  play = true,
  meter = 1,
  label,
  value
}: IAnimatedMeterProps) {
  const meterId = Math.min(Math.max(meter - 1, 0), meters.length - 1);
  const data = meters[meterId];

  return (
    <div className={styles.AnimatedMeter}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.meter}>
        <Lottie
          animationData={data}
          direction={1}
          speed={0.3}
          play={play}
          segments={[0, value[0]]}
          loop={1}
          className={styles.lottie}
        />
        <Lottie
          animationData={data}
          direction={1}
          speed={0.3}
          play={play}
          segments={[0, value[1]]}
          loop={1}
          className={styles.lottie}
        />
      </div>
    </div>
  );
}

export default AnimatedMeter;
