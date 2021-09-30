import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import initStore from '@store/store';
import App from './App';
import Borked from './components/Borked';
import reportWebVitals from './reportWebVitals';

import '@styles/app.scss';

const sentryDsn = __SENTRY_ENABLED__ ? __SENTRY_DSN__ : '';

Sentry.init({
  environment: __ENVIRONMENT__,
  dsn: sentryDsn,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={initStore()}>
      <Sentry.ErrorBoundary fallback={<Borked />}>
        <App />
      </Sentry.ErrorBoundary>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
