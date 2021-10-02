import React from 'react';
import { connect } from 'react-redux';

import { ModalStartBand } from '@uiComponents';
import constants from '@constants';
import { IRootState } from '@store/types';
import { TModalStartBandStep } from '@uiTypes';
import ui from '@store/ui';
import usm from '@store/usm';

export type TStartBandModalProps = IStartBandModalState &
  IStartBandModalDispatch;

export interface IStartBandModalState {
  bandName: string;
  activeArtistName: string;
  activeArtistImageSrc: string;
  txStatus: string;
  isOpen: boolean;
}

export interface IStartBandModalDispatch {
  hideModal: () => void;
}

export const mapTxStatusToStep: Record<string, TModalStartBandStep> = {
  [constants.usm.transactionStatus.SUBMITTED]: 'pending',
  [constants.usm.transactionStatus.AUTHORIZED]: 'pending',
  [constants.usm.transactionStatus.MINED]: 'success',
  [constants.usm.transactionStatus.FAILED]: 'error'
};

export function getStep(txStatus: string): TModalStartBandStep {
  return mapTxStatusToStep[txStatus] || 'confirm';
}

export class StartBandModal extends React.Component<TStartBandModalProps> {
  onStartBand = () => {
    console.log('TODO');
  };

  render(): JSX.Element {
    const {
      bandName,
      activeArtistName,
      activeArtistImageSrc,
      txStatus,
      isOpen,
      hideModal
    } = this.props;

    const props = {
      bandName,
      activeArtistName,
      activeArtistImageSrc,
      step: getStep(txStatus),
      isOpen,
      onHide: hideModal,
      onStartBand: this.onStartBand
    };

    return <ModalStartBand {...props} />;
  }
}

// %HACK% Typescript is expecting getTransactionStatusByType to only accept 1 argumnet this is a workaround
type HackSelector = (
  state: IRootState,
  props: Record<string, string>
) => string;

export function mapState(state: IRootState): IStartBandModalState {
  const activeArtistTid = usm.selectors.getActiveArtistTid(state);
  return {
    isOpen: ui.selectors.shouldShowModal(state),
    bandName: usm.selectors.getSuggestedBandName(state),
    activeArtistName: usm.selectors.getActiveArtistName(state),
    activeArtistImageSrc: usm.selectors.getActiveArtistImageUrl(state),
    txStatus: (usm.selectors.getTransactionStatusByType as HackSelector)(
      state,
      {
        type: 'start-band',
        artistTid: activeArtistTid
      }
    )
  };
}

export const mapDispatch = {
  hideModal: ui.actions.hideModal
};

export default connect(mapState, mapDispatch)(StartBandModal);
