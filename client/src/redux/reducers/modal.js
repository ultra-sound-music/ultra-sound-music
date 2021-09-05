import * as ActionTypes from '../actionTypes';

const initialState = Object.freeze({
  shouldShowModal: false,
  modalTitle: '',
  modalBodyText: '',
  modalCTA: ''
});

export default function modalReducer(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case ActionTypes.SHOW_MODAL: {
      let body;
      if (typeof data.bodyText === 'string') {
        body = data.bodyText;
      } else {
        body = JSON.stringify(data.bodyText);
      }

      const newState = {
        ...state,
        shouldShowModal: true,
        modalTitle: data.title,
        modalBodyText: body,
        modalCTA: data.ctaText
      };

      return newState;
    }

    case ActionTypes.HIDE_MODAL: {
      const newState = {
        ...state,
        shouldShowModal: false,
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
