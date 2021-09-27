import React from 'react';

import ui from '@store/ui';
import { IRootState } from '@store/types';
import { Modal } from '@uiComponents';
import { connect } from 'react-redux';

export type TModalProps = IStandardModalState & IStandardModalDispatch;

export type TModalType = 'standard' | 'start-band';

export interface IStandardModalState {
  title: React.ReactNode;
  bodyText: React.ReactNode;
  ctaText: React.ReactNode;
  isOpen: boolean;
}

export interface IStandardModalDispatch {
  hideModal: () => void;
}

export class StandardModal extends React.Component<TModalProps> {
  render(): JSX.Element {
    const { title, bodyText, ctaText, isOpen, hideModal } = this.props;

    const props = {
      title,
      bodyText,
      ctaText,
      isOpen,
      onHide: hideModal
    };

    return <Modal {...props} />;
  }
}

export function mapState(state: IRootState): IStandardModalState {
  return {
    isOpen: ui.selectors.shouldShowModal(state),
    title: ui.selectors.getModalTitle(state),
    bodyText: ui.selectors.getModalBody(state),
    ctaText: ui.selectors.getModalCta(state)
  };
}

export const mapDispatch = {
  hideModal: ui.actions.hideModal
};

export default connect(mapState, mapDispatch)(StandardModal);
