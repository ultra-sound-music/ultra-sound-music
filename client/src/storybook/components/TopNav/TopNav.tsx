import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import { Image } from '@components';
import usmLogo from '@images/usmLogo.png';

import styles from './TopNav.scss';

export interface ITopNavItem {
  itemName: string;
  text: string;
  to: string;
  isRoot?: boolean;
}

export interface ITopNavProps {
  items: ITopNavItem[];
}

export const TopNav = ({ items }: ITopNavProps): JSX.Element => {
  return (
    <div className={styles.TopNav}>
      <NavLink
        to={'/'}
        className={styles.topNavItem}
        activeClassName={styles.active}
      >
        <Image src={usmLogo} />
      </NavLink>

      {items.map(({ text, to, isRoot }): JSX.Element => {
        return (
          <NavLink
            key={text}
            to={to}
            exact={isRoot}
            className={styles.topNavItem}
            activeClassName={styles.active}
          >
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default TopNav;
