import { NavLink } from 'react-router-dom';
import { ReactComponent as Logo } from '@usm/images/logo_white.svg';

import NavLinks from '../Nav/Nav';

import styles from './SiteHeader.scss';

export interface ISiteHeaderProps {
  nav?: React.ReactElement<typeof NavLinks>;
}

export const SiteHeader = ({
  nav
}: ISiteHeaderProps): JSX.Element => {
  return (
    <div className={styles.SiteHeader}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <NavLink to='/' className={styles.logoLink}>
            <Logo className={styles.logo} />
            <div className={styles.usm}>Ultra<br/>Sound<br/>Music</div>
          </NavLink>
          
        </div>
        {nav && <div className={styles.topNav}>{nav}</div>}
      </div>
    </div>
  );
};

export default SiteHeader;
