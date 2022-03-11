import cn from 'clsx';
import solLogo from '@usm/assets/img/solana_logo_s.svg';

import Image from '../../Image/Image';
import styles from './SolanaIcon.scss';

export interface SolanaIconProps {
  size: 'tiny' | 'small' | 'medium';
  className?: string;
}

export function SolanaIcon({ className, size, ...props }: SolanaIconProps) {
  const classNames = cn(className, styles.SolanaIcon, styles[size]);
  return <Image {...props} src={solLogo} className={classNames} />;
}

export default SolanaIcon;
