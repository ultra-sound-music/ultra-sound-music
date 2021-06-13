import { combineReducers } from 'redux';

import tokensReducer from './tokens';
import modalReducer from './modal';
import userReducer from './user';
import web3Reducer from './web3';

const rootReducer = combineReducers({
  modal: modalReducer,
  user: userReducer,
  tokens: tokensReducer,
  web3: web3Reducer,
});

export default rootReducer;
