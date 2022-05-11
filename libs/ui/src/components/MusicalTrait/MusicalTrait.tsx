import { useEffect, useState } from 'react';
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

export type IMusicalTraitProps = {
  name: string;
  value: string;
  play?: boolean;
};

// This is a horrible way to handle this, ideally each asset gets loaded asynchronously
// but atm, attempting it doesn't seem to work with alias paths
export const traitsMap = {
  energy_aggress: aggressiveMeter,
  energy_relaxed: relaxedMeter,
  energy_upbeat: upbeatMeter,
  melody_complex: complexMeter,
  melody_harmonic: harmonicMeter,
  texture_noisy: noisyMeter,
  texture_smooth: smoothMeter
};

// export async function loadMeter(name: string, value: string) {
//   const url = `../../../../assets/src/lottie/musical_traits/${name}_${value}.json`;
//   return import(url);
// }

export function getMeter(name: string, value: string) {
  return traitsMap[`${name}_${value}` as keyof typeof traitsMap];
}

export function MusicalTrait({ name, value, play = true }: IMusicalTraitProps) {
  const [data, setData] = useState<object>();
  const classNames = cn(styles.MusicMeter, styles[name]);

  useEffect(() => {
    if (!name || !value) {
      return;
    }

    ReactTooltip.rebuild();
    const data = getMeter(name, value);
    setData(data);
  }, [name, value]);

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
        renderer='svg'
        rendererSettings={undefined}
        audioFactory={undefined}
        className={styles.lottie}
      />
    </div>
  );
}

export default MusicalTrait;
