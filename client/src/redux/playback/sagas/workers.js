import { select, put } from 'redux-saga/effects';
import UsmPlayer from '@lib/UsmPlayer';
import mediator from '@store/mediator';

import * as actions from '../actions';

let player;

export function init() {
  player = new UsmPlayer();
}

export function* toggle({ data }) {
  let entityId = data?.entityId;
  let isPlaying;

  try {
    if (entityId) {
      const audioUrl = yield select(
        mediator.selectors.getTokenAudioUrl,
        entityId
      );
      player.play(audioUrl);
      isPlaying = true;
    } else {
      player.stop();
      isPlaying = false;
    }

    if (isPlaying) {
      yield put(actions.playSuccess({ entityId }));
    } else {
      yield put(actions.stopSuccess());
    }
  } catch (error) {
    console.log(error);
  }
}
