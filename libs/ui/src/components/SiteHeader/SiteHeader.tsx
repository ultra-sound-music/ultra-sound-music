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
      {nav && <div className={styles.topNav}>{nav}</div>}
    </div>
  );
};

export default SiteHeader;
