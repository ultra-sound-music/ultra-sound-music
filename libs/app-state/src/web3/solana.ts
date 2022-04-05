import { useMemo } from 'react';

import {
  atom,
  selector,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
  DefaultValue,
  useRecoilState,
  useResetRecoilState
} from 'recoil';
import Usm, { USMAuctionData, PublicKey, BidMutationResponse } from '@usm/auction';

import { Wallet } from '@metaplex/js';
import SolClient from '@usm/sol-client';
import config from '@usm/config';

import * as ui from '../ui';
import { localStorageEffect } from '../utils';

import * as web3Constants from './constants';

export interface IWeb3State {
  accountAddress: string;
  networkStatus: string;
  networkId: string;
  isConnected: boolean;
}

export interface IWalletState {
  balance?: number;
}

export type IAuctionIsLoading = boolean;

export type IUpdateNetworkStateProps = Partial<IWeb3State>;

export interface UpdateAuctionCallbackArgs {
  updater(): Promise<BidMutationResponse>;
  processingMessage: string;
  successMessage: string;
  confirmedMessage: string;
  errorMessage: string;
  loadAuction(b: boolean): Promise<void>;
  showNotification(args: ui.INotificationState): void;
}

const storePubKey = new PublicKey(config.storePubKey || '');
const auctionPubkey = new PublicKey(config.auctionPubKey || '');
let solClient: SolClient;
let usm: Usm;

export const accountAddressState = atom<IWeb3State['accountAddress']>({
  key: 'accountAddressState',
  default: '',
  effects: [localStorageEffect<string>('accountAddress')]
});

export const networkStatusState = atom<IWeb3State['networkStatus']>({
  key: 'networkStatusState',
  default: ''
});

export const networkIdState = atom<IWeb3State['networkId']>({
  key: 'networkIdState',
  default: ''
});

export const isConnectedState = atom<IWeb3State['isConnected']>({
  key: 'isConnectedState',
  default: false
});

export const balanceState = atom<IWalletState['balance']>({
  key: 'balanceState',
  default: undefined
});

export const networkState = selector<Partial<IWeb3State>>({
  key: 'networkState',
  get: ({ get }) => ({
    accountAddress: get(accountAddressState),
    networkStatus: get(networkStatusState),
    networkId: get(networkIdState),
    isConnected: get(isConnectedState)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(accountAddressState);
      reset(networkStatusState);
      reset(networkIdState);
      reset(isConnectedState);
      return;
    }

    set(accountAddressState, newState.accountAddress || '');
    set(networkStatusState, newState.networkStatus || '');
    set(networkIdState, newState.networkId || '');
    set(isConnectedState, !!newState.isConnected);
  }
});

export const auctionIsLoadingState = atom<IAuctionIsLoading>({
  key: 'auctionIsLoadingState',
  default: false
});

export const auctionState = atom<USMAuctionData | undefined>({
  key: 'usmAuctionState',
  default: undefined
});

export function useSolClient() {
  const [accountBalance, setAccountBalance] = useAccountBalance();
  const resetAccountBalance = useResetRecoilState(balanceState);
  const updateNetworkState = useUpdateNetworkState();

  if (!solClient) {
    solClient = new SolClient();

    solClient.on('disconnect', () => {
      resetAccountBalance();
      updateNetworkState({
        accountAddress: '',
        networkStatus: web3Constants.networkStatus.NOT_CONNECTED,
        networkId: '',
        isConnected: false
      });
    });
  }

  return solClient;
}

export function useUsm() {
  const solClient = useSolClient();

  if (!usm) {
    const connection = config.solanaCluster as string;
    const accounts = {
      wallet: solClient.wallet as Wallet,
      store: storePubKey,
      auction: auctionPubkey
    };

    usm = new Usm(connection, accounts);
  }

  return usm;
}

export function useAccountBalance() {
  return useRecoilState(balanceState);
}

export function useGetAccountAddress() {
  return useRecoilValue(accountAddressState);
}

export function useGetNetworkStatus() {
  return useRecoilValue(networkStatusState);
}

export function useGetNetworkId() {
  return useRecoilValue(networkIdState);
}

export function useIsConnected() {
  return !!useRecoilValue(isConnectedState);
}

export function useLoadAuction() {
  const loadAuction = useAuctionLoader();
  const [networkState] = useNetwork();
  const [auction, setAuction] = useAuction();
  const [isLoading, setIsLoading] = useAuctionIsLoading();

  return useMemo(
    () => ({
      auction,
      setAuction,
      isLoading,
      setIsLoading,
      loadAuction
    }),
    [networkState, auction, isLoading]
  );
}

export function useAuctionIsLoading() {
  return useRecoilState(auctionIsLoadingState);
}

export function useAuction() {
  return useRecoilState(auctionState);
}

export function useUpdateNetworkState() {
  return useSetRecoilState(networkState);
}

export function useNetwork() {
  return useRecoilState(networkState);
}

export function useAuctionLoader() {
  const [prevAuction, setAuction] = useAuction();
  const [, setIsLoading] = useAuctionIsLoading();
  const usm = useUsm();
  const showNotification = ui.useShowNotification();

  return useRecoilCallback(
    () =>
      async (forceRefresh = false) => {
        if (prevAuction && !forceRefresh) {
          return;
        }

        try {
          setIsLoading(true);
          const auction = await usm.getAuctionData(auctionPubkey);

          setIsLoading(false);
          setAuction(auction);
        } catch (error) {
          console.error(error);
          showNotification({
            title: 'Error',
            message: 'Failed loading auction data',
            type: 'error'
          });
        }
      },
    []
  );
}

export function usePlaceBid() {
  const { auction, setIsLoading, loadAuction } = useLoadAuction();
  const { showModal } = ui.useModal();
  const showNotification = ui.useShowNotification();
  const usm = useUsm();

  return useRecoilCallback(() => async (amountInSol: number) => {
    if (!auction) {
      console.error('Unable to place bid: auction not loaded');
      return;
    }

    const currentBid = auction?.bids[0]?.bid || 0;
    if (amountInSol <= currentBid) {
      showModal({
        withCloseX: false,
        body: 'Bid must be greater than the top bid'
      });
      return;
    }

    showNotification({
      type: 'processing',
      message: 'Your bid is being processed'
    });

    try {
      setIsLoading(true);
      const { confirmTransaction } = await usm.placeBid(amountInSol, auctionPubkey);

      await loadAuction(true);
      showNotification({
        title: 'Success',
        message: 'Your bid has been placed. Waiting for final confirmation',
        type: 'processing'
      });

      await confirmTransaction();
      showNotification({
        title: 'Success',
        message: 'Your bid has been recorded',
        type: 'success'
      });
    } catch (error) {
      console.error(error);
      showNotification({
        title: 'Error',
        message: 'Failed to placing bid.  Please try again',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }

    loadAuction();
  });
}

export async function updateAuctionCallback({
  updater,
  processingMessage,
  successMessage,
  confirmedMessage,
  errorMessage,
  loadAuction,
  showNotification
}: UpdateAuctionCallbackArgs) {
  showNotification({
    type: 'processing',
    message: processingMessage
  });

  try {
    const { result, confirmTransaction } = await updater();

    showNotification({
      title: 'Success',
      message: successMessage,
      type: 'processing'
    });

    await loadAuction(true);
    await confirmTransaction();

    showNotification({
      title: 'Success',
      message: confirmedMessage,
      type: 'success',
      timeout: 3500
    });
  } catch (error) {
    console.error(error);
    showNotification({
      title: 'Error',
      message: errorMessage,
      type: 'error'
    });
  }
}

export function useUpdateAuction() {
  const showNotification = ui.useShowNotification();
  const loadAuction = useAuctionLoader();

  // We return a function, that calls a function that takes a function as an argument and returns a function ¯\_(ツ)_/¯
  // Sorry, this is confusing AF but the tradeoff is it centralizes all this logic in one place
  return (args: Omit<UpdateAuctionCallbackArgs, 'showNotification' | 'loadAuction'>) =>
    useRecoilCallback(() => async () => {
      updateAuctionCallback({ showNotification, loadAuction, ...args });
    });
}

export function useRedeemBid() {
  const updateAuction = useUpdateAuction();
  return updateAuction({
    updater: () => usm.redeemBid(),
    processingMessage: 'Redeeming your NFT.',
    successMessage: 'Redemption Approved.  Waiting for final confirmation...',
    confirmedMessage: 'Your NFT has been redeemed!',
    errorMessage: 'Failed to redeem your NFT.  Please try again'
  });
}

export function useRedeemParticipationToken() {
  const updateAuction = useUpdateAuction();
  return updateAuction({
    updater: () => usm.redeemParticipationBid(),
    processingMessage: 'Redeeming your participation NFT',
    successMessage: 'Redemption Approved.  Waiting for final confirmation...',
    confirmedMessage: 'Your NFT has been redeemed!',
    errorMessage: 'Failed to redeem your NFT.  Please try again'
  });
}

export function useRefundBid() {
  const updateAuction = useUpdateAuction();
  return updateAuction({
    updater: () => usm.cancelBid(),
    processingMessage: 'Processing your refund',
    successMessage: 'Refund approved.  Waiting for final confirmation',
    confirmedMessage: 'Your refund has been confirmed.',
    errorMessage: 'Failed to refund your bid.  Please try again'
  });
}

export function useConnect() {
  const [, setBalance] = useAccountBalance();
  const showNotification = ui.useShowNotification();
  const updateNetworkStatus = useUpdateNetworkState();
  const solClient = useSolClient();
  const usm = useUsm();

  return useRecoilCallback(
    () => async () => {
      try {
        updateNetworkStatus({
          networkStatus: web3Constants.networkStatus.CONNECTING
        });

        const accountAddress = await solClient.connectWallet();
        updateNetworkStatus({
          accountAddress,
          networkStatus: web3Constants.networkStatus.CONNECTED,
          networkId: '',
          isConnected: true
        });

        const balance = await usm.getWalletBalance();
        setBalance(balance);
      } catch (error) {
        updateNetworkStatus({
          networkStatus: web3Constants.networkStatus.NOT_CONNECTED
        });

        showNotification({
          title: 'Error',
          message: 'Failed to connect',
          type: 'error'
        });
      }
    },
    []
  );
}

export function useDisconnect() {
  const showNotification = ui.useShowNotification();
  const solClient = useSolClient();

  return useRecoilCallback(
    () => async () => {
      try {
        await solClient.disconnectWallet();
      } catch (error) {
        showNotification({
          title: 'Error',
          type: 'error'
        });
      }
    },
    []
  );
}
