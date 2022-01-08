import { ReactNode } from 'react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';

import logo from '@usm/images/logo_white.svg';
import copy from '@usm/copy';
import { Image } from '../Image/Image';

import styles from './SiteFooter.scss';

export function SiteFooter() {
  return (
    <div className={styles.SiteFooter}>
      <Image src={logo} className={styles.logo}/>
      <div className={styles.usm}>{copy.usm_long}</div>
      <div className={styles.copyright}>{copy.copyright}</div>
      <div className={styles.socials}>
        <FaDiscord />
        <FaTwitter />
      </div>
    </div>
  );
}

export default SiteFooter;
