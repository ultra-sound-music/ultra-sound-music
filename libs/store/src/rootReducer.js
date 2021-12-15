import { combineReducers } from 'redux';

import configsReducer from './configs/reducer';
import uiReducer from './ui/reducer';
import playbackReducer from './playback/reducer';
import usmReducer from './usm/reducer';
import web3Reducer from './web3/reducer';

const rootReducer = combineReducers({
  configs: configsReducer,
  playback: playbackReducer,
  ui: uiReducer,
  usm: usmReducer,
  web3: web3Reducer
});

export default rootReducer;
