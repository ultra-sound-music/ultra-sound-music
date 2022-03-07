import { RiDiscordFill, RiTwitterFill } from 'react-icons/ri';

import logo from '@usm/assets/img/logo_white.svg';
import { interpolate } from '@usm/util-string';
import { copy, urls } from '@usm/content';

import Image from '../Image/Image';
import Link from '../Link/Link';

import styles from './SiteFooter.scss';

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <div className={styles.SiteFooter}>
      <div className={styles.brand}>
        <Image src={logo} className={styles.logo} />
        <div className={styles.usm}>{copy.usm_long}</div>
      </div>
      <div className={styles.copyright}>
        {interpolate(copy.copyright, year)}
      </div>
      <div className={styles.socials}>
        <Link to={urls.usmDiscord}>
          <RiDiscordFill />
        </Link>
        <Link to={urls.usmTwitter}>
          <RiTwitterFill />
        </Link>
      </div>
    </div>
  );
}

export default SiteFooter;
