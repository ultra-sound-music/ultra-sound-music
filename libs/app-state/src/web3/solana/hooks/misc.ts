import { useEffect } from 'react';
import { useRecoilCallback, useResetRecoilState, useSetRecoilState } from 'recoil';

import logger from '@usm/util-logger';

import { useShowNotification } from '../../../ui';
import {
  networkStatusState,
  accountAddressState,
  useAccountBalance,
  useNetworkStatus,
  useAccountAddress
} from '../models/wallet';
import { connectWallet, disconnectWallet, getWalletBalance } from '../api/api';

export interface UpdateAuctionMessaging {
  processingMessage: string;
  successMessage: string;
  confirmedMessage: string;
  errorMessage: string;
}

export function useConnect() {
  const showNotification = useShowNotification();
  const setNetworkStatus = useSetRecoilState(networkStatusState);
  const setAccountAddress = useSetRecoilState(accountAddressState);
  const [, setAccountBalance] = useAccountBalance();
  return useRecoilCallback(() => async () => {
    try {
      setNetworkStatus('CONNECTING');
      const walletAddress = await connectWallet();
      if (!walletAddress) {
        throw new Error('Missing wallet address');
      }
      setAccountAddress(walletAddress);
      getWalletBalance().then((balance) => {
        setAccountBalance(balance);
      });
      setNetworkStatus('CONNECTED');
    } catch (error) {
      logger.error(error);
      setNetworkStatus('ERRORED');
      showNotification({
        title: 'Error',
        message: 'Failed to connect',
        type: 'error',
        timeout: true
      });
    }
  });
}

export function useDisconnect() {
  const updateNetworkStatus = useSetRecoilState(networkStatusState);
  const resetWalletAddress = useResetRecoilState(accountAddressState);
  const showNotification = useShowNotification();

  return useRecoilCallback(
    () => async () => {
      try {
        await disconnectWallet();
        updateNetworkStatus('NOT_CONNECTED');
        resetWalletAddress();
      } catch (error) {
        logger.error(error);
        showNotification({
          title: 'Error',
          type: 'error'
        });
      }
    },
    []
  );
}

export function useGetWalletBalance() {
  const [walletBalance, setWalletBalance] = useAccountBalance();
  const [networkStatus] = useNetworkStatus();
  const walletAddress = useAccountAddress();

  useEffect(() => {
    if (networkStatus === 'CONNECTED') {
      getWalletBalance().then((balance) => {
        setWalletBalance(balance);
      });
    }
  }, [networkStatus, walletAddress]);

  return walletBalance;
}
