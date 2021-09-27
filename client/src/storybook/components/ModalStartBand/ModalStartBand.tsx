import React from 'react';
import { Modal, Button, EntityRow } from '@uiComponents';

import copy from '@copy';

export type TModalStartBandStep = 'confirm' | 'pending' | 'success' | 'error';

export interface IModalStartBandProps {
  bandName: string;
  activeArtistName: string;
  activeArtistImageSrc: string;
  step: TModalStartBandStep;
  isOpen: boolean;
  onHide: () => void;
  onStartBand: () => void;
}

export const ModalStartBand = ({
  bandName,
  step,
  activeArtistName,
  activeArtistImageSrc,
  isOpen,
  onHide,
  onStartBand
}: IModalStartBandProps): JSX.Element => {
  let onClick: () => void;
  let userMessage: string;
  let buttonText: string;
  let isProcessing: boolean;
  switch (step) {
    case 'confirm': {
      onClick = onStartBand;
      userMessage = copy.review_band_details_before_creating;
      buttonText = copy.confirm;
      isProcessing = false;
      break;
    }

    case 'pending': {
      userMessage = copy.review_band_details_before_creating;
      buttonText = copy.confirm;
      isProcessing = true;
      break;
    }

    case 'success': {
      onClick = onHide;
      userMessage = copy.congratulations_band_has_been_created;
      buttonText = copy.close;
      isProcessing = false;
      break;
    }

    case 'error': {
      onClick = onHide;
      userMessage = copy.error_creating_band;
      buttonText = copy.close;
      isProcessing = false;
      break;
    }

    default: {
      break;
    }
  }

  return (
    <Modal
      subject={copy.start_band}
      ctaButton={
        <Button type='primary' isProcessing={isProcessing} onClick={onClick}>
          {buttonText}
        </Button>
      }
      isOpen={isOpen}
      onHide={onHide}
    >
      {userMessage && <div>{userMessage}</div>}
      <div>{copy.with}</div>
      <div className='artistRow'>
        <EntityRow imageSrc={activeArtistImageSrc} line1={activeArtistName} />
      </div>
      <div>{copy.name_of_band}</div>
      <div className='bandName'>{bandName}</div>
    </Modal>
  );
};

export default ModalStartBand;
