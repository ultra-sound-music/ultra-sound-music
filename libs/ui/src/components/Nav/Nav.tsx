import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'clsx';

import BurgerMenu from '../BurgerMenu/BurgerMenu';
import Link from '../Link/Link';

import styles from './Nav.scss';

export interface INavItem {
  content: React.ReactNode;
  to: string;
}

export interface INavProps {
  items: readonly INavItem[];
}

export interface IActiveCheck {
  isActive: boolean;
}

export function renderItems(items: readonly INavItem[]) {
  return items?.map(({ content, to }, index): JSX.Element => {
    const isExternalUrl = typeof to === 'string' && to?.startsWith('http');
    const props = {
      key: index,
      to: to
    };

    if (isExternalUrl) {
      return (
        <Link {...props} className={styles.navItem}>
          {content}
        </Link>
      );
    } else {
      const className = ({ isActive }: IActiveCheck) =>
        cn(styles.navItem, isActive && styles.isActive);
      return (
        <NavLink className={className} {...props}>
          {content}
        </NavLink>
      );
    }
  });
}

export const Nav = ({ items }: INavProps): JSX.Element => {
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean | undefined>();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (!mediaQuery || !mediaQuery.addEventListener) {
      return;
    }

    setShowBurgerMenu(mediaQuery.matches);

    function eventHandler(event: MediaQueryListEvent): void {
      event.matches ? setShowBurgerMenu(true) : setShowBurgerMenu(false);
    }

    mediaQuery.addEventListener('change', eventHandler);

    return () => {
      mediaQuery.removeEventListener('change', eventHandler);
    };
  }, []);

  return (
    <div className={styles.Nav}>
      {(() => {
        if (showBurgerMenu === true) {
          return <BurgerMenu>{renderItems(items)}</BurgerMenu>;
        } else if (showBurgerMenu === false) {
          return renderItems(items);
        }

        return;
      })()}
    </div>
  );
};

export default Nav;
