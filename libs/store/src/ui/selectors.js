export function shouldShowModal(state) {
  return state.ui.shouldShowModal;
}

export function getModalType(state) {
  return state.ui.modalType;
}

export function getModalProps(state) {
  return state.ui.modalProps;
}

export function getModalTitle(state) {
  return state.ui.modalTitle;
}

export function getModalBody(state) {
  return state.ui.modalBody;
}

export function getModalCta(state) {
  return state.ui.modalCta;
}

export function isAppMessageOpen(state) {
  return state.ui.isAppMessageOpen;
}

export function getAppMessageTitle(state) {
  return state.ui.appMessageTitle;
}

export function getAppMessageMessage(state) {
  return state.ui.appMessageMessage;
}

export function getAppMessageTimeout(state) {
  return state.ui.appMessageTimeout;
}
