import * as ActionTypes from './actionTypes';

const initialState = Object.freeze({
  shouldShowModal: false,
  modalType: '',
  modalProps: {},
  modalTitle: '',
  modalBody: '',
  modalCta: '',
  isAppMessageOpen: false,
  appMessageTitle: '',
  appMessageMessage: '',
  appMessageTimeout: null
});

export function getStandardModalState(state, payload) {
  const newState = {
    ...state,
    shouldShowModal: true,
    modalType: payload.type,
    modalTitle: payload.title,
    modalBody: payload.body,
    modalCta: payload.ctaText
  };

  return newState;
}

export function getInstallWalletModalState(state, { type }) {
  return {
    ...state,
    shouldShowModal: true,
    modalType: type
  };
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
  'install-wallet': getInstallWalletModalState,
  'start-band': getStandardModalState,
  'join-band': getJoinBandModalState,
  'mint-track': getMintTrackModalState
};

export default function uiReducer(state = initialState, action) {
  const { type, payload = {} } = action;

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
        modalBody: initialState.modalBody,
        modalCTA: initialState.modalCTA
      };

      return newState;
    }

    case ActionTypes.HIDE_APP_MESSAGE: {
      const newState = {
        ...state,
        isAppMessageOpen: initialState.isAppMessageOpen
      };

      return newState;
    }

    case ActionTypes.SHOW_APP_MESSAGE: {
      const { title, message, timeout } = payload;

      const newState = {
        ...state,
        isAppMessageOpen: true,
        appMessageTitle: title || initialState.appMessageTitle,
        appMessageMessage: message || initialState.appMessageMessage,
        appMessageTimeout: timeout || initialState.timeout
      };

      return newState;
    }

    default:
      return state;
  }
}
