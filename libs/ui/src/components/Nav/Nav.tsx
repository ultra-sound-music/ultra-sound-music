import { NavLink } from 'react-router-dom';
import cn from 'clsx';

import Link from '../Link/Link';

import styles from './Nav.scss';

export interface INavItem {
  content: React.ReactNode;
  to: string;
}

export interface INavProps {
  items: INavItem[];
}

export interface IActiveCheck {
  isActive: boolean;
}

export const Nav = ({ items }: INavProps): JSX.Element => {
  return (
    <div className={styles.Nav}>
      {items?.map(({ content, to }): JSX.Element => {
        const isExternalUrl = typeof to === 'string' && to?.startsWith('http');
        const props = {
          key: content?.toString(),
          to: to
        };

        if (isExternalUrl) {
          return <Link {...props} className={styles.navItem}>{content}</Link>
        } else {
          const className = ({ isActive }: IActiveCheck) => cn(styles.navItem, isActive && styles.isActive);
          return <NavLink className={className} {...props}>{content}</NavLink>
        }
      })}
    </div>
  );
};

export default Nav;
