import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as Sentry from '@sentry/react';

import rootSaga from './rootSaga';
import rootReducer from './rootReducer';
import app from './app';
import { storeUtils } from './utils';

const sagaMiddleware = createSagaMiddleware();
const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  /** @TODO Add options? */
});

export default () => {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(sagaMiddleware),
      sentryReduxEnhancer,
      typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : (emptyval) => emptyval
    )
  );

  storeUtils.setStore(store);
  sagaMiddleware.run(rootSaga);
  store.dispatch(app.actions.init());

  return store;
};
