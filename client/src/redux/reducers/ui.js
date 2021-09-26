import * as ActionTypes from '../actionTypes';

const initialState = Object.freeze({
  shouldShowModal: false,
  modalType: '',
  modalProps: null,
  modalTitle: '',
  modalBodyText: '',
  modalCTA: ''
});

export function getStandardModalState(state, payload) {
  let body;
  if (typeof payload.bodyText === 'string') {
    body = payload.bodyText;
  } else {
    body = JSON.stringify(payload.bodyText);
  }

  const newState = {
    ...state,
    shouldShowModal: true,
    modalType: payload.type,
    modalTitle: payload.title,
    modalBodyText: body,
    modalCTA: payload.ctaText
  };

  return newState;
}

export function getStartBandModalState(state, { type }) {
  return {
    ...state,
    shouldShowModal: true,
    modalType: type
  };
}

export function getJoinBandModalState(state, { type, bandId }) {
  return {
    ...state,
    shouldShowModal: true,
    modalType: type,
    modalProps: { bandId }
  };
}

export function getMintTrackModalState(state, { type, bandId }) {
  return {
    ...state,
    shouldShowModal: true,
    modalType: type,
    modalProps: { bandId }
  };
}

export const modalMap = {
  standard: getStandardModalState,
  'start-band': getStandardModalState,
  'join-band': getJoinBandModalState,
  'mint-track': getMintTrackModalState
};

export default function uiReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.SHOW_MODAL: {
      const modalType = payload.type;
      if (!modalType) {
        return state;
      }

      return modalMap[modalType](state, payload);
    }

    case ActionTypes.HIDE_MODAL: {
      const newState = {
        ...state,
        shouldShowModal: initialState.shouldShowModal,
        modalType: initialState.modalType,
        modalProps: initialState.modalProps,
        modalTitle: initialState.modalTitle,
        modalBodyText: initialState.modalBodyText,
        modalCTA: initialState.modalCTA
      };

      return newState;
    }

    default:
      return state;
  }
}
