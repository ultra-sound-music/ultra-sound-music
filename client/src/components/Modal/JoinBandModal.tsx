import React from 'react';

import ui from '@store/ui';
import { IRootState } from '@store/types';
import { Button, ModalBandOverview } from '@components';
import { connect } from 'react-redux';
import usm from '@store/usm';

export type TModalProps = IJoinBandModalState & IJoinBandModalDispatch;
export type TModalType = 'standard' | 'start-band';

export interface IJoinBandModalState {
  bandName: string;
  bandTraits: { name: string; value: string }[];
  bandMembers: Record<string, string>[];
  bodyText: React.ReactNode;
  ctaText: React.ReactNode;
}

export interface IJoinBandModalDispatch {
  hideModal: () => void;
}

export class JoinBandModal extends React.Component<TModalProps> {
  render(): JSX.Element {
    const { bandName, bandMembers, bandTraits, hideModal } = this.props;

    const props = {
      subject: 'Band Overview',
      bandName,
      bandMembers,
      currentStep: 1,
      totalSteps: 3,
      traits: bandTraits,
      ctaButton: <Button>{}</Button>,
      onHideModal: hideModal
    };

    return <ModalBandOverview {...props} />;
  }
}

export function mapState(
  state: IRootState,
  { bandId }: Record<string, string>
): IJoinBandModalState {
  return {
    bandName: usm.selectors.getBandName(state, bandId),
    bandTraits: usm.selectors.getBandTraits(state, bandId),
    bandMembers: usm.selectors.getBandMembers(state, bandId),
    bodyText: ui.selectors.getModalBody(state),
    ctaText: ui.selectors.getModalCta(state)
  };
}

export const mapDispatch = {
  hideModal: ui.actions.hideModal
};

export default connect(mapState, mapDispatch)(JoinBandModal);
