import React from 'react';
import { connect } from 'react-redux';

import copy from '@copy';
import constants from '@constants';
import ui from '@store/ui';
import { Modal, Button } from '@uiComponents';
import { IRootState } from '@store/types';

export type TInstallWalletModalProps = IInstallWalletModalState &
  IInstallWalletModalActions;

export interface IInstallWalletModalState {
  isOpen: boolean;
}

export interface IInstallWalletModalActions {
  hideModal: () => void;
}

export const InstallWalletModal = ({
  isOpen,
  hideModal
}: TInstallWalletModalProps): JSX.Element => {
  const link = {
    pathname: constants.web3.METAMASK_DOWNLOAD_URL
  };

  return (
    <Modal
      title={copy.need_wallet}
      withCloseButton={false}
      ctaButton={
        <Button to={link} type='primary' isExternal={true}>
          {copy.install_metamask}
        </Button>
      }
      isOpen={isOpen}
      onHide={hideModal}
    />
  );
};

export const mapState = (state: IRootState): IInstallWalletModalState => {
  return {
    isOpen: ui.selectors.shouldShowModal(state)
  };
};

export const mapActions: IInstallWalletModalActions = {
  hideModal: ui.actions.hideModal
};

export default connect(mapState, mapActions)(InstallWalletModal);
