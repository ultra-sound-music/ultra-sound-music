import React from 'react';
import StandardModal from './StandardModal';
import StartBandModal from './StartBandModal';
import JoinBandModal from './JoinBandModal';
import MintTrackModal from './MintTrackModal';

export type TModalType = 'standard' | 'start-band';

export interface IModalProps {
  type: TModalType;
  modalProps: Record<string, unknown>;
}

export const modals = {
  standard: StandardModal,
  'start-band': StartBandModal,
  'join-band': JoinBandModal,
  'mint-track': MintTrackModal
};

export const ModalComponent = ({
  type,
  modalProps
}: IModalProps): JSX.Element => {
  if (!type) {
    return null;
  }

  const Modal = modals[type];
  return <Modal {...modalProps} />;
};

export default ModalComponent;
