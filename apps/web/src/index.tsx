import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import * as Sentry from '@sentry/react';

import config from '@usm/config';
import logger from '@usm/util-logger';
import { Spinner } from '@usm/ui';
import { reportWebVitals } from '@usm/util-web';

import DebugObserver from './tools/Debug/Debug';
import App from './components/App/App';
import Borked from './components/Borked/Borked';

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
    <Sentry.ErrorBoundary fallback={<Borked />}>
      <BrowserRouter>
        <RecoilRoot>
          <DebugObserver />
          <Suspense fallback={<Spinner cover='fixed' />}>
            <App />
          </Suspense>
        </RecoilRoot>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>,
  document.getElementById('root')
);

// reportWebVitals(logger.info);
