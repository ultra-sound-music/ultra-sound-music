import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagas';
import rootReducer from './reducers';
import * as Actions from './actions';
import * as ReduxUtils from './utils';

const sagaMiddleware = createSagaMiddleware()

export default () => {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(sagaMiddleware),
      typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (emptyval) => emptyval
    )
  );

  ReduxUtils.setStore(store);
  sagaMiddleware.run(rootSaga);
  store.dispatch(Actions.app.init());

  return store;
}