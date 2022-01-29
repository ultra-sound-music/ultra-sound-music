import { Routes, Route } from 'react-router-dom';
import { RiDiscordFill, RiTwitterFill } from 'react-icons/ri';

import { Button, Link, Nav, SiteFooter, SiteHeader } from '@usm/ui';
import { copy, urls, routes } from '@usm/content';

import Home from '../../pages/Landing/Landing';
import PageNotFound from '../PageNotFound/PageNotFound';

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
    content: <RiDiscordFill style={{ color: '#5865f2' }} />,
    to: urls.usmDiscord
  },
  {
    content: <RiTwitterFill style={{ color: '#1da1f2' }} />,
    to: urls.usmTwitter
  }
]);

const params = new URLSearchParams(window.location.search);
const weAreLive =
  params.get('wearelive') === 'true' || params.get('wearelive') === '1';

const App = () => (
  <div className={styles.App}>
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
      <Route path='*' element={<PageNotFound />} />
    </Routes>
    <div className={styles.footer}>
      <SiteFooter />
    </div>
  </div>
);

export default App;
