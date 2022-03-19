import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import cn from 'clsx';
import Lottie from 'react-lottie-player';

import aggressiveMeter from '@usm/assets/lottie/musical_traits/energy_aggressive.json';
import relaxedMeter from '@usm/assets/lottie/musical_traits/energy_relaxed.json';
import upbeatMeter from '@usm/assets/lottie/musical_traits/energy_upbeat.json';
import complexMeter from '@usm/assets/lottie/musical_traits/melody_complex.json';
import harmonicMeter from '@usm/assets/lottie/musical_traits/melody_harmonic.json';
import noisyMeter from '@usm/assets/lottie/musical_traits/texture_noisy.json';
import smoothMeter from '@usm/assets/lottie/musical_traits/texture_smooth.json';

import styles from './MusicalTrait.scss';

const meters = {
  aggressiveMeter,
  relaxedMeter,
  upbeatMeter,
  complexMeter,
  harmonicMeter,
  noisyMeter,
  smoothMeter
};

export type IMusicalTraitProps = {
  name: string;
  value: string;
  play?: boolean;
};

export function getMeter(value: keyof typeof meters) {
  return meters[value];
}

export function MusicalTrait({ name, value, play = true }: IMusicalTraitProps) {
  const data = getMeter(value as keyof typeof meters);
  const classNames = cn(styles.MusicMeter, styles[name]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <div className={classNames} data-tip={value}>
      <div className={styles.label}>
        <div className={styles.bullet} />
        {name}
      </div>
      <Lottie
        animationData={data}
        direction={1}
        speed={0.5}
        play={play}
        segments={[0, 30]}
        loop={1}
        className={styles.lottie}
      />
    </div>
  );
}

export default MusicalTrait;
