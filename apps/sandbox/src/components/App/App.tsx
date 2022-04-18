import { SiteFooter, SiteHeader } from '@usm/ui';

import logo from '@usm/assets/img/logo.png';
import { SolanaButton, Modal, Notification } from '@usm/components';
import { useAppInit } from '@usm/app-state';

import Sandbox from '../Sandbox/Sandbox';

import styles from './App.scss';

export function App() {
  useAppInit({ logo });

  return (
    <div className={styles.App}>
      <div className={styles.header}>
        <SiteHeader ctaButton={<SolanaButton />} />
      </div>
      <div className={styles.body}>
        <Sandbox />
      </div>
      <div className={styles.footer}>
        <SiteFooter />
      </div>
      <Notification />
      <Modal />
    </div>
  );
}

export default App;
