import { ReactNode } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { slide as Menu } from 'react-burger-menu';

import styles from './BurgerMenu.scss';

export interface BurgerMenuProps {
  children: ReactNode;
}

export function BurgerMenu({ children }: BurgerMenuProps) {
  return (
    <Menu
      customCrossIcon={<RiCloseLine />}
      burgerButtonClassName={styles.burgerButton}
      burgerBarClassName={styles.burgerBars}
      crossButtonClassName={styles.crossButton}
      crossClassName={styles.cross}
      menuClassName={styles.menu}
      morphShapeClassName={styles.morphShape}
      itemListClassName={styles.itemList}
      itemClassName={styles.item}
      overlayClassName={styles.overlay}
      right
    >
      {children}
    </Menu>
  );
}

export default BurgerMenu;
