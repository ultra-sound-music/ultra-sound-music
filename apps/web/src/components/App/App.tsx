import { Routes, Route } from 'react-router-dom';
import { Link, Nav, SiteFooter, SiteHeader } from '@usm/ui';
import { copy, urls, routes } from '@usm/content';

import Home from '../../pages/Landing/Landing';

import styles from './App.scss';

const nav = [
  {
    content: copy.blog,
    to: urls.usmBlog,
  },
  {
    content: copy.docs,
    to: urls.usmDocs,
  }
];

const App = () => (
  <div className={styles.App}>
    <div className={styles.header}>
      <SiteHeader nav={<Nav items={nav}/>} />
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