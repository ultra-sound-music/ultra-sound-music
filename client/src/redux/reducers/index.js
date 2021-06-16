import { combineReducers } from 'redux';

import modalReducer from './modal';
import playbackReducer from './playback';
import userReducer from './user';
import usmReducer from './usm';
import web3Reducer from './web3';

const rootReducer = combineReducers({
  modal: modalReducer,
  playback: playbackReducer,
  user: userReducer,
  usm: usmReducer,  
  web3: web3Reducer,
});

export default rootReducer;
