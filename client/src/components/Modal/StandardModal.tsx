import React from 'react';

import ui from '@store/ui';
import { IRootState } from '@store/types';
import { Modal, Button } from '@uiComponents';
import { connect } from 'react-redux';

export type TModalProps = IStandardModalState & IStandardModalDispatch;

export type TModalType = 'standard' | 'start-band';

export interface IStandardModalState {
  title: React.ReactNode;
  body: React.ReactNode;
  ctaText: React.ReactNode;
  isOpen: boolean;
}

export interface IStandardModalDispatch {
  hideModal: () => void;
}

export class StandardModal extends React.Component<TModalProps> {
  render(): JSX.Element {
    const { title, body, ctaText, isOpen, hideModal } = this.props;

    const props = {
      title,
      ctaButton: ctaText ? <Button type='secondary'>{ctaText}</Button> : null,
      isOpen,
      withCloseButton: false,
      onHide: hideModal
    };

    return <Modal {...props}>{body}</Modal>;
  }
}

export function mapState(state: IRootState): IStandardModalState {
  return {
    isOpen: ui.selectors.shouldShowModal(state),
    title: ui.selectors.getModalTitle(state),
    body: ui.selectors.getModalBody(state),
    ctaText: ui.selectors.getModalCta(state)
  };
}

export const mapDispatch = {
  hideModal: ui.actions.hideModal
};

export default connect(mapState, mapDispatch)(StandardModal);
