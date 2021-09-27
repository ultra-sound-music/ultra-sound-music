import React, { useCallback } from 'react';

import {
  Modal,
  EntityRow,
  InlineList,
  StepIndicator,
  Avatar
} from '@uiComponents';

export interface IModalStartBandProps {
  subject: string;
  message?: React.ReactNode;
  artistName?: string;
  artistImageSrc?: string;
  bandName: string;
  bandMembers?: Record<string, string>[];
  trackName?: string;
  trackImageSrc?: string;
  currentStep?: number;
  totalSteps?: number;
  isOpen: boolean;
  ctaButton: JSX.Element;
  onHide: () => void;
}

export const ModalStartBand = ({
  subject,
  message,
  artistName,
  artistImageSrc,
  bandName,
  bandMembers,
  trackName,
  trackImageSrc,
  currentStep,
  totalSteps,
  isOpen,
  ctaButton,
  onHide
}: IModalStartBandProps): JSX.Element => {
  const genAvatar = useCallback(
    (src) => {
      return <Avatar src={src} size='small' />;
    },
    [bandMembers]
  );

  return (
    <Modal
      subject={subject}
      ctaButton={ctaButton}
      isOpen={isOpen}
      onHide={onHide}
    >
      {message && <div>{message}</div>}
      {artistName && artistImageSrc && (
        <div>
          <EntityRow imageSrc={artistImageSrc} line1={artistName} />
        </div>
      )}
      {bandName && bandMembers && (
        <div>
          <InlineList items={bandMembers.map(genAvatar)} />
        </div>
      )}
      {trackName && trackImageSrc && (
        <div>
          <EntityRow imageSrc={trackImageSrc} line1={trackName} />
        </div>
      )}
      {currentStep && totalSteps && (
        <div>
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      )}
    </Modal>
  );
};

export default ModalStartBand;
