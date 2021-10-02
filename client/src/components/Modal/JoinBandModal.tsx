import React from 'react';

import ui from '@store/ui';
import { IRootState } from '@store/types';
import { Button, ModalBandOverview } from '@uiComponents';
import { connect } from 'react-redux';
import usm from '@store/usm';
import { ITraitsDefinition } from '@uiTypes';

export type TModalProps = IJoinBandModalState & IJoinBandModalDispatch;
export type TModalType = 'standard' | 'start-band';

export interface IJoinBandModalState {
  bandName: string;
  bandTraits: ITraitsDefinition;
  bandMembers: Record<string, string>[];
  isOpen: boolean;
  ctaText: React.ReactNode;
}

export interface IJoinBandModalDispatch {
  hideModal: () => void;
}

export class JoinBandModal extends React.Component<TModalProps> {
  render(): JSX.Element {
    const { bandName, bandMembers, bandTraits, isOpen, hideModal } = this.props;

    const props = {
      subject: 'Band Overview',
      bandName,
      bandMembers,
      currentStep: 1,
      totalSteps: 3,
      traits: bandTraits,
      isOpen: isOpen,
      ctaButton: <Button>{}</Button>,
      onHide: hideModal
    };

    return <ModalBandOverview {...props} />;
  }
}

export function mapState(
  state: IRootState,
  { bandId }: Record<string, string>
): IJoinBandModalState {
  return {
    isOpen: ui.selectors.shouldShowModal(state),
    bandName: usm.selectors.getBandName(state, bandId),
    bandTraits: usm.selectors.getBandTraits(state, bandId),
    bandMembers: usm.selectors.getBandMembers(state, bandId),
    ctaText: ui.selectors.getModalCta(state)
  };
}

export const mapDispatch = {
  hideModal: ui.actions.hideModal
};

export default connect(mapState, mapDispatch)(JoinBandModal);
