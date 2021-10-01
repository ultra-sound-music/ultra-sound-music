import { combineReducers } from 'redux';

import configsReducer from '../configs/reducer';
import uiReducer from './ui';
import playbackReducer from './playback';
import usmReducer from './usm';
import web3Reducer from './web3';

const rootReducer = combineReducers({
  configs: configsReducer,
  playback: playbackReducer,
  ui: uiReducer,
  usm: usmReducer,
  web3: web3Reducer
});

export default rootReducer;
