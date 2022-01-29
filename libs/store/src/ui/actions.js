import * as ActionTypes from './actionTypes';

export function updateAppUI() {
  return {
    type: 'UPDATE_APP_UI'
  };
}

export function showModal({ title, body, ctaText }) {
  return {
    type: ActionTypes.SHOW_MODAL,
    payload: {
      type: 'standard',
      title,
      body,
      ctaText
    }
  };
}

export function hideModal() {
  return {
    type: ActionTypes.HIDE_MODAL
  };
}

export function showInstallWalletModal() {
  return {
    type: ActionTypes.SHOW_MODAL,
    payload: {
      type: 'install-wallet'
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

export function showAppMessage({ title, message, timeout }) {
  return {
    type: ActionTypes.SHOW_APP_MESSAGE,
    payload: {
      title,
      message,
      timeout
    }
  };
}

export function hideAppMessage() {
  return {
    type: ActionTypes.HIDE_APP_MESSAGE
  };
}
