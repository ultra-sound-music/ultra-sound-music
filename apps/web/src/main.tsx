import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import * as Sentry from '@sentry/react';

import { configs } from '@usm-web/configs';
import { Spinner } from '@usm/ui';
import { App, Borked } from '@usm-web/components';

import DebugObserver from './tools/Debug/Debug';

import '@usm/styles/global.scss';

if (configs.sentryIsEnabled) {
  const sentryDsn = configs.sentryDNS;
  Sentry.init({
    environment: configs.environment,
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
