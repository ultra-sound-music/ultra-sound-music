import { Routes, Route } from 'react-router-dom';
import { RiDiscordFill, RiTwitterFill } from 'react-icons/ri';
import ReactTooltip from 'react-tooltip';

import { INavItem, Link, Nav, SiteFooter, SiteHeader } from '@usm/ui';
import { copy, urls, routes } from '@usm/content';
import config from '@usm/config';

import Home from '../Landing/Landing';
import NetworkButton from '../Buttons/NetworkButton/NetworkButton';
import Modal from '../Modal/Modal';
import Notification from '../Notification/Notification';
import PageNotFound from '../PageNotFound/PageNotFound';

import styles from './App.scss';

export let nav: INavItem[] = [
  {
    content: copy.blog,
    to: urls.usmBlog
  },
  {
    content: copy.docs,
    to: urls.usmDocs
  }
];

const weAreLive = !!config.weAreLive;

if (!weAreLive) {
  nav = nav.concat([
    {
      content: <RiDiscordFill style={{ color: '#5865f2' }} />,
      to: urls.usmDiscord
    },
    {
      content: <RiTwitterFill style={{ color: '#1da1f2' }} />,
      to: urls.usmTwitter
    }
  ]);
}

const App = () => (
  <div className={styles.App}>
    <div className={styles.header}>
      <SiteHeader
        nav={<Nav items={nav} />}
        ctaButton={weAreLive ? <NetworkButton /> : undefined}
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
    <ReactTooltip className={styles.tooltips} />
    <Notification />
    <Modal />
  </div>
);

export default App;
