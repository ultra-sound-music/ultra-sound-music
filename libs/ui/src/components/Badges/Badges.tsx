import debut from '@usm/assets/img/badges/debut.png'
import hometown from '@usm/assets/img/badges/hometown.png'
import version from '@usm/assets/img/badges/version.png'

import Image from '../Image/Image';

import styles from './Badges.scss';

const badgesMap: Record<string, string> = {
  debut,
  hometown,
  version
}

export interface IBadgesProps {
  names: ('debut' | 'hometown' | 'version')[]
}

export function Badges({ names }: IBadgesProps) {
  return (
    <div className={styles.Badges}>
      {names.map((name: string) => {
        return <div key={name} className={styles.badge}><Image src={badgesMap[name]} /></div>
      })}
    </div>
  );
}

export default Badges;
