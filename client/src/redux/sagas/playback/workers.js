import { select, call, put } from 'redux-saga/effects';
import * as Actions from '../../actions';
import * as Selectors from '../../selectors/core';

export function* init() {}

function toggleSingleArtistPlayback(...args) {
  console.log(...args);
}

function toggleTrackAudioPlayback(...args) {
  console.log(...args);
}

// @TODO this is a temporary solution for mapping to the current way of generating trackDNA
export function tempTrackSourceMapper(dna) {
  if (typeof dna === 'string') {
    return dna;
  }

  const trackCreator = dna.pop();
  const mappedDNA = dna.slice(0, 4);
  return mappedDNA.sort((x, y) => {
    return x == trackCreator ? -1 : y == trackCreator ? 1 : 0;
  });
}

export function* toggle({ data }) {
  let source = data?.source;

  // If we didn't pass a source in, maybe this is a "stop" command, in which case we get what's currently playing...
  if (!source) {
    source = yield select(Selectors.playback.selectActiveSource);
  }

  const playableSource = tempTrackSourceMapper(
    source.startsWith('0x')
      ? source
      : yield select(Selectors.usm.selectPlayableSourceById, source)
  );
  try {
    const isPlaying = Array.isArray(playableSource)
      ? yield call(toggleTrackAudioPlayback, ...playableSource)
      : yield call(toggleSingleArtistPlayback, playableSource);

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
