import * as ActionTypes from '../actionTypes';

export function updateAppUI() {
  return {
    type: 'UPDATE_APP_UI'
  };
}

export function showModal({ title, bodyText, ctaText }) {
  return {
    type: ActionTypes.SHOW_MODAL,
    payload: {
      type: 'standard',
      title,
      bodyText,
      ctaText
    }
  };
}

export function showStartBandModal() {
  return {
    type: ActionTypes.SHOW_MODAL,
    payload: {
      type: 'start-band'
    }
  };
}

export function showJoinBandModal({ bandId }) {
  return {
    type: ActionTypes.SHOW_MODAL,
    payload: {
      type: 'join-band',
      bandId
    }
  };
}

export function showMintTrackModal({ bandId }) {
  return {
    type: ActionTypes.SHOW_MODAL,
    payload: {
      type: 'mint-track',
      bandId
    }
  };
}

export function hideModal() {
  return {
    type: ActionTypes.HIDE_MODAL
  };
}
