import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import * as Sentry from "@sentry/react";

import rootSaga from './sagas';
import rootReducer from './reducers';
import * as Actions from './actions';
import * as ReduxUtils from './utils';

const sagaMiddleware = createSagaMiddleware()
const sentryReduxEnhancer = Sentry.createReduxEnhancer({ /** @TODO Add options? */});

export default () => {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(sagaMiddleware),
      sentryReduxEnhancer,
      typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (emptyval) => emptyval
    )
  );

  ReduxUtils.setStore(store);
  sagaMiddleware.run(rootSaga);
  store.dispatch(Actions.app.init());

  return store;
}