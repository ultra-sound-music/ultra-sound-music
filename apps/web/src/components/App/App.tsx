import { Routes, Route, Link} from 'react-router-dom';
import { SiteHeader, Nav, SiteFooter } from '@usm/ui';
import { copy } from '@usm/content';

import Home from '../../pages/Landing/Landing';

import styles from './App.scss';

const nav = [
  {
    content: copy.docs,
    to: '/docs',
  },
  {
    content: copy.memplayer,
    to: '/memplayer',
  }
];

const App = () => (
  <div className={styles.App}>
    <SiteHeader nav={<Nav items={nav}/>} />
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    <div className={styles.footer}>
      <SiteFooter />
    </div>
  </div>
);

export default App;