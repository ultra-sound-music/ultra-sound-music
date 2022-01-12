import { select } from 'redux-saga/effects';
import UsmPlayer from '@lib/UsmPlayer';
import mediator from '@usm/store/mediator';
import { storeUtils } from '@usm/store/utils';

import * as actions from '../actions';

// const defaultUrl = 'https://storageapi.fleek.co/ultrasoundmusic-team-bucket/trim_abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde_zyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxw_1633123514640.wav';
let player;

export function getPlayer() {
  if (!player) {
    const { dispatch } = storeUtils.getStore();

    player = new UsmPlayer({
      logger: {
        info: console.info,
        error: console.error
      },
      onPlay: ({ id }) => {
        dispatch(actions.onPlaySuccess({ entityId: id }));
      },

      onStop: ({ id }) => {
        dispatch(actions.onStopSuccess({ entityId: id }));
      },

      onLoad: ({ id }) => {
        dispatch(actions.onLoadSuccess({ entityId: id }));
      }
    });
  }

  return player;
}

export function* play({ payload }) {
  const entityId = payload?.entityId;
  const audioUrl = yield select(mediator.selectors.getTokenAudioUrl, entityId);

  try {
    const player = getPlayer();
    player.play({
      audioUrl: audioUrl || '',
      id: entityId
    });
  } catch (error) {
    console.error(error);
  }
}

export function stop() {
  try {
    const player = getPlayer();
    player.pause();
  } catch (error) {
    console.error(error);
  }
}
