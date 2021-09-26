import React, { useCallback } from 'react';

import { Modal, TraitsBlock, EntityRow, StepIndicator } from '@components';
import { ITraitDefinition } from '@uiTypes';

import copy from '@copy';

export interface IModalBandOverviewProps {
  subject: string;
  bandName: string;
  currentStep: number;
  totalSteps: number;
  bandMembers?: Record<string, string>[];
  traits?: ITraitDefinition[];
  ctaButton: JSX.Element;
  onHideModal: () => void;
}

export const ModalBandOverview = ({
  subject,
  bandName,
  currentStep,
  totalSteps,
  traits,
  bandMembers,
  ctaButton,
  onHideModal
}: IModalBandOverviewProps): JSX.Element => {
  const renderBandMember = useCallback(
    ({ imageSrc, name }) => {
      return (
        <li>
          <EntityRow imageSrc={imageSrc} line1={name} />
        </li>
      );
    },
    [bandMembers]
  );

  return (
    <Modal
      subject={subject}
      title={bandName}
      ctaButton={ctaButton}
      onHideModal={onHideModal}
    >
      <div>
        <TraitsBlock traits={traits} />
      </div>
      <div>
        <div>{copy.current_members}</div>
        <div>
          <ul>{bandMembers.map(renderBandMember)}</ul>
        </div>
      </div>
      <div>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </Modal>
  );
};

export default ModalBandOverview;
