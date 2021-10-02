import React, { useCallback } from 'react';

import { Modal, TraitsBlock, EntityRow, StepIndicator } from '@uiComponents';
import { ITraitsDefinition } from '@uiTypes';

import copy from '@copy';

export interface IModalBandOverviewProps {
  subject: string;
  bandName: string;
  currentStep: number;
  totalSteps: number;
  bandMembers?: Record<string, string>[];
  traits?: ITraitsDefinition;
  isOpen: boolean;
  ctaButton: JSX.Element;
  onHide: () => void;
}

export const ModalBandOverview = ({
  subject,
  bandName,
  currentStep,
  totalSteps,
  traits,
  bandMembers,
  isOpen,
  ctaButton,
  onHide
}: IModalBandOverviewProps): JSX.Element => {
  const renderBandMember = useCallback(
    ({ imageSrc, name }) => {
      return (
        <li key={name}>
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
      isOpen={isOpen}
      ctaButton={ctaButton}
      onHide={onHide}
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
