import Lottie from 'react-lottie-player';

import debut from '@usm/assets/lottie/badges/debut.json';
import hometown from '@usm/assets/lottie/badges/hometown.json';
import version from '@usm/assets/lottie/badges/version.json';

import styles from './Badges.scss';

export type ILottieJson = Record<string, object> | undefined;

const badgesMap: Record<string, object> = {
  debut,
  hometown,
  version
};

export interface IBadgesProps {
  play?: boolean;
  names: ('debut' | 'hometown' | 'version')[];
}

export function Badges({ play = true, names }: IBadgesProps) {
  return (
    <div className={styles.Badges}>
      {names?.map((name, i) => {
        return (
          <div key={i} className={styles.badge}>
            <Lottie
              animationData={badgesMap[name]}
              direction={1}
              speed={0.5}
              play={play}
              loop={false}
              className={styles.lottie}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Badges;
