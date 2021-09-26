import { combineReducers } from 'redux';

import uiReducer from './ui';
import playbackReducer from './playback';
import usmReducer from './usm';
import web3Reducer from './web3';

const rootReducer = combineReducers({
  ui: uiReducer,
  playback: playbackReducer,
  usm: usmReducer,
  web3: web3Reducer
});

export default rootReducer;
