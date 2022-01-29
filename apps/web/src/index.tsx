import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';

import config from '@usm/config';

import App from './components/App/App';

import '@usm/styles/global.scss';

if (process.env.USM_SENTRY_ENABLED) {
  const sentryDsn = process.env.USM_NX_SENTRY_DNS;
  Sentry.init({
    environment: config.environment,
    dsn: sentryDsn,
    integrations: [],
    tracesSampleRate: 0
  });
}

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
