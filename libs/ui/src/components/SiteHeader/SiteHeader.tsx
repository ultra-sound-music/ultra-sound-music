import { NavLink } from 'react-router-dom';
import { ReactComponent as Logo } from '@usm/assets/img/logo_white.svg';

import NavLinks from '../Nav/Nav';
import Button from '../Button/Button';

import styles from './SiteHeader.scss';

export interface ISiteHeaderProps {
  nav?: React.ReactElement<typeof NavLinks>;
  ctaButton?: React.ReactElement<typeof Button>;
}

export const SiteHeader = ({
  nav,
  ctaButton
}: ISiteHeaderProps): JSX.Element => {
  return (
    <div className={styles.SiteHeader}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <NavLink to='/' className={styles.logoLink}>
            <Logo className={styles.logo} />
            <div className={styles.usm}>
              Ultra
              <br />
              Sound
              <br />
              Music
            </div>
          </NavLink>
        </div>
        <div className={styles.actions}>
          {nav}
          {ctaButton}
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
