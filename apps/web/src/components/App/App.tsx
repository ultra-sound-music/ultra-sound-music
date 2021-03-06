import { Routes, Route } from 'react-router-dom';
import { RiDiscordFill, RiTwitterFill } from 'react-icons/ri';
import ReactTooltip from 'react-tooltip';

import { INavItem, Link, Nav, SiteFooter, SiteHeader } from '@usm/ui';
import { SolanaButton, Notification } from '@usm/components';
import { copy, urls, routes } from '@usm/content';
import config from '@usm/config';

import Home from '../Landing/Landing';
import { Modal } from '@usm/components';
import { useAppInit } from '@usm/app-state';

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

const LFG = !!config.LFG;

if (!LFG) {
  nav = nav.concat([
    {
      content: <RiDiscordFill />,
      to: urls.usmDiscord
    },
    {
      content: <RiTwitterFill />,
      to: urls.usmTwitter
    }
  ]);
}

export function App() {
  useAppInit();

  return (
    <div className={styles.App}>
      <div className={styles.header}>
        <SiteHeader nav={<Nav items={nav} />} ctaButton={LFG ? <SolanaButton /> : undefined} />
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
}

export default App;
