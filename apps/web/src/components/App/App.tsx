import { Routes, Route } from 'react-router-dom';
import { FaDiscord, FaTwitter } from 'react-icons/fa';

import { Button, Link, Nav, SiteFooter, SiteHeader } from '@usm/ui';
import { copy, urls, routes } from '@usm/content';
import { ReactComponent as Triangle1 } from '@usm/images/triangle1.svg';
import { ReactComponent as Triangle3 } from '@usm/images/triangle3.svg';

import Home from '../../pages/Landing/Landing';

import styles from './App.scss';

export const nav = Object.freeze([
  {
    content: copy.blog,
    to: urls.usmBlog
  },
  {
    content: copy.docs,
    to: urls.usmDocs
  },
  {
    content: <FaDiscord />,
    to: urls.usmDiscord
  },
  {
    content: <FaTwitter />,
    to: urls.usmTwitter
  }
]);

const params = new URLSearchParams(window.location.search);
const weAreLive =
  params.get('wearelive') === 'true' || params.get('wearelive') === '1';

const App = () => (
  <div className={styles.App}>
    <div className={styles.tri1}>
      <Triangle1 />
    </div>
    <div className={styles.tri3}>
      <Triangle3 />
    </div>
    <div className={styles.header}>
      <SiteHeader
        nav={<Nav items={nav} />}
        ctaButton={
          weAreLive ? <Button type='primary'>Connect</Button> : undefined
        }
      />
    </div>
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.blog} element={<Link to={urls.usmBlog} />} />
    </Routes>
    <div className={styles.footer}>
      <SiteFooter />
    </div>
  </div>
);

export default App;
