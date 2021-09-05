import * as ActionTypes from '../actionTypes';

export function updateAppUI() {
  return {
    type: 'UPDATE_APP_UI'
  };
}

export function showModal({ title, bodyText, ctaText }) {
  return {
    type: ActionTypes.SHOW_MODAL,
    data: {
      title,
      bodyText,
      ctaText
    }
  };
}

export function hideModal() {
  return {
    type: ActionTypes.HIDE_MODAL
  };
}
