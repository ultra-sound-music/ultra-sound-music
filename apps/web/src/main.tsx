import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import * as Sentry from '@sentry/react';

import config from '@usm/config';
import { Spinner } from '@usm/ui';

import DebugObserver from './tools/Debug/Debug';
import App from './components/App/App';
import Borked from './components/Borked/Borked';

import '@usm/styles/global.scss';

if (config.sentryIsEnabled) {
  const sentryDsn = config.sentryDNS;
  Sentry.init({
    environment: config.environment,
    dsn: sentryDsn,
    integrations: [],
    tracesSampleRate: 0
  });
}

ReactDOM.render(
  <StrictMode>
    {/* @ts-expect-error - Temporary until this is fixed: https://github.com/getsentry/sentry-javascript/issues/4904  */}
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
