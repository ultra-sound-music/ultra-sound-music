import Lottie from 'react-lottie-player';

import bar from '@usm/assets/lottie/2_a.json';

import styles from './AnimatedMeter.scss';

export interface IAnimatedMeterProps {
  label?: string;
  value: [number, number];
}

export function AnimatedMeter({ label, value }: IAnimatedMeterProps) {
  return (
    <div className={styles.AnimatedMeter}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.meter}>
        <Lottie
          animationData={bar}
          direction={1}
          speed={0.5}
          play={true}
          segments={[0, value[0]]}
          loop={false}
          className={styles.lottie}
        />
        <Lottie
          animationData={bar}
          direction={1}
          speed={0.5}
          play={true}
          segments={[0, value[1]]}
          loop={false}
          className={styles.lottie}
        />
      </div>
    </div>
  );
}

export default AnimatedMeter;
