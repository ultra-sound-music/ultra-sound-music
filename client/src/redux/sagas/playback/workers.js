import { select, call, put } from 'redux-saga/effects'
import { togglePlayback, toggleTrackAudioPlayback } from '../../../audio'
import * as Actions from '../../actions';
import * as Selectors from '../../selectors';

export function* init() {
  // yield call(togglePlayback);
}

export function* toggle({ data }) {
  let source = data?.source;

  // If we didn't pass a source in, maybe this is a "stop" command, in which case we get what's currently playing...
  if (!source) {
    source = yield select(Selectors.playback.selectActiveSource);
  }

  const playableSource = typeof source === 'string' ? source : yield select(Selectors.usm.selectPlayableSourceByTokenId, source);
  const playbacktoggler = Array.isArray(playableSource) ? toggleTrackAudioPlayback : togglePlayback;
  try {
    const isPlaying = yield call(playbacktoggler, playableSource);
    if (isPlaying) {
      yield put(Actions.playback.playSuccess({ source }));
    } else {
      yield put(Actions.playback.stopSuccess());
    }
    
  } catch (error) {
    // @TODO
    // yield put(Actions.playback.stopFail);
    // OR
    // yield put(Actions.playback.playFail);
  }
}
