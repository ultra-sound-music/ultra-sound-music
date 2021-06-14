import { combineReducers } from 'redux';

import modalReducer from './modal';
import playbackReducer from './playback';
import tokensReducer from './tokens';
import userReducer from './user';
import web3Reducer from './web3';

const rootReducer = combineReducers({
  modal: modalReducer,
  playback: playbackReducer,
  tokens: tokensReducer,
  user: userReducer,
  web3: web3Reducer,
});

export default rootReducer;
