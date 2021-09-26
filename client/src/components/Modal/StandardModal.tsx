import React from 'react';

import ui from '@store/ui';
import { IRootState } from '@store/types';
import { Modal } from '@components';
import { connect } from 'react-redux';

export type TModalProps = IStandardModalState & IStandardModalDispatch;

export type TModalType = 'standard' | 'start-band';

export interface IStandardModalState {
  title: React.ReactNode;
  bodyText: React.ReactNode;
  ctaText: React.ReactNode;
}

export interface IStandardModalDispatch {
  hideModal: () => void;
}

export class StandardModal extends React.Component<TModalProps> {
  render(): JSX.Element {
    const { title, bodyText, ctaText, hideModal } = this.props;

    const props = {
      title,
      bodyText,
      ctaText,
      onHideModal: hideModal
    };

    return <Modal {...props} />;
  }
}

export function mapState(state: IRootState): IStandardModalState {
  return {
    title: ui.selectors.getModalTitle(state),
    bodyText: ui.selectors.getModalBody(state),
    ctaText: ui.selectors.getModalCta(state)
  };
}

export const mapDispatch = {
  hideModal: ui.actions.hideModal
};

export default connect(mapState, mapDispatch)(StandardModal);
