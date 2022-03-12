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

export interface IEnergyTraitProps {
  name: 'energy';
  value: 'aggressive' | 'relaxed' | 'upbeat';
}

export interface IMelodyTraitProps {
  name: 'melody';
  value: 'complex' | 'harmonic';
}

export interface ITextureTraitProps {
  name: 'texture';
  value: 'harmonic' | 'noisy' | 'smooth';
}

export type IAllMusicalTraitProps =
  | IEnergyTraitProps
  | IMelodyTraitProps
  | ITextureTraitProps;

export type IMusicalTraitProps = IAllMusicalTraitProps & {
  play: boolean;
};

export function MusicalTrait({ name, value, play = true }: IMusicalTraitProps) {
  const data = meters[`${value}Meter`];
  const classNames = cn(styles.MusicMeter, styles[name]);
  return (
    <div className={classNames}>
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
