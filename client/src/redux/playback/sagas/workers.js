import { select, put } from 'redux-saga/effects';
import UsmPlayer from '@lib/UsmPlayer';
import mediator from '@store/mediator';

import * as actions from '../actions';

// const defaultUrl = 'https://storageapi.fleek.co/ultrasoundmusic-team-bucket/trim_abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde_zyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxw_1633123514640.wav';
let player;

export function getPlayer() {
  if (!player) {
    player = new UsmPlayer({
      logger: {
        info: console.info,
        error: console.error
      }
    });
  }

  return player;
}

export function* play({ data }) {
  const entityId = data?.entityId;
  const audioUrl = yield select(mediator.selectors.getTokenAudioUrl, entityId);

  try {
    const player = getPlayer();
    player.play(audioUrl || '');
    yield put(actions.playSuccess({ entityId }));
  } catch (error) {
    console.error(error);
  }
}

export function* stop() {
  try {
    const player = getPlayer();
    player.stop();
    yield put(actions.stopSuccess());
  } catch (error) {
    console.error(error);
  }
}
