import { NavLink } from 'react-router-dom';
import cn from 'clsx';

import styles from './Nav.scss';

export interface INavItem {
  content: React.ReactNode;
  to: string;
  isRoot?: boolean;
}

export interface INavProps {
  items: INavItem[];
}

export const Nav = ({ items }: INavProps): JSX.Element => {
  return (
    <div className={styles.Nav}>
      {items?.map(({ content, to, isRoot }): JSX.Element => {
        return (
          <NavLink
            key={content?.toString()}
            to={to}
            className={({ isActive }) => cn(styles.navItem, isActive && styles.isActive)}
          >
            {content}
          </NavLink>
        );
      })}
    </div>
  );
};

export default Nav;
