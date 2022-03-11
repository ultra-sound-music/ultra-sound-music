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

import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Wallet } from '@metaplex/js';
import SolClient, {
  Auction,
  USMClient,
  USMBidData,
  IN_PROGRESS_AUCTION_PUBKEY
} from '@usm/sol-client';

import * as ui from '../ui';
import { localStorageEffect } from '../utils';

import * as web3Constants from './constants';

export { web3Constants };

export interface IWeb3State {
  accountAddress: string;
  networkStatus: string;
  networkId: string;
  isConnected: boolean;
}

export interface IBidDataState {
  bids: USMBidData[];
  winner?: USMBidData;
}

export interface IAuctionState {
  isLoading: boolean;
  bidData?: IBidDataState;
  auctionData?: Auction;
}

export interface IWalletState {
  balance?: number;
}

export type IUpdateNetworkStateProps = Partial<IWeb3State>;

let solClient: SolClient;
let usmClient: USMClient;

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

export const auctionIsLoadingState = atom<IAuctionState['isLoading']>({
  key: 'auctionIsLoadingState',
  default: false
});

export const bidDataState = atom<IAuctionState['bidData']>({
  key: 'bidDataState',
  default: undefined
});

export const auctionDataState = atom<IAuctionState['auctionData']>({
  key: 'auctionDataState',
  default: undefined
});

// @TODO - remove balance state from auction state
export const auctionState = selector<Partial<IAuctionState>>({
  key: 'auctionState',
  get: ({ get }) => ({
    isLoading: get(auctionIsLoadingState),
    bidData: get(bidDataState),
    auctionData: get(auctionDataState)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(auctionIsLoadingState);
      reset(bidDataState);
      reset(auctionDataState);
      return;
    }

    if (newState.isLoading !== undefined) {
      set(auctionIsLoadingState, newState.isLoading);
    }

    if (newState.bidData) {
      set(bidDataState, newState.bidData);
    }

    if (newState.auctionData) {
      set(auctionDataState, newState.auctionData);
    }
  }
});

export function getSolClient() {
  if (!solClient) {
    solClient = new SolClient();
  }

  return solClient;
}

export function getUSMClient() {
  if (!usmClient) {
    const solClient = getSolClient();
    const connection = new Connection(clusterApiUrl());
    usmClient = new USMClient(connection, solClient.wallet as Wallet);
  }

  return usmClient;
}

export function useAccountBalance() {
  return useRecoilState(balanceState);
}

export function useGetAccountAddress() {
  return useRecoilValue(accountAddressState);
}

export function useGetShortenedAccountAddress() {
  const addr = useGetAccountAddress();
  if (!addr) {
    return addr;
  } else {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
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
  const [auction, setAuction] = useRecoilState(auctionState);

  return useMemo(
    () => ({
      auction,
      setAuction,
      loadAuction
    }),
    [networkState, auction]
  );
}

export function useAuctionState() {
  return useRecoilState(auctionState);
}

export function useUpdateNetworkState() {
  return useSetRecoilState(networkState);
}

export function useNetwork() {
  return useRecoilState(networkState);
}

export function useAuctionLoader() {
  const [prevAuctionData, setAuctionData] = useAuctionState();
  const showNotification = ui.useShowNotification();

  return useRecoilCallback(
    ({ snapshot }) =>
      async (forceRefresh = false) => {
        if (prevAuctionData.auctionData && !forceRefresh) {
          return;
        }

        try {
          setAuctionData({
            isLoading: true
          });

          usmClient = getUSMClient();
          const auctionData = await usmClient.getAuction(
            IN_PROGRESS_AUCTION_PUBKEY
          );
          const bidData = await usmClient.getAuctionData(
            IN_PROGRESS_AUCTION_PUBKEY
          );

          return setAuctionData({
            isLoading: false,
            auctionData,
            bidData
          });
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

export function usePlaceBid(amountInSol: number) {
  const { auction, setAuction, loadAuction } = useLoadAuction();
  const { showModal } = ui.useModal();
  const { showNotification, hideNotification } = ui.useNotification();

  return useRecoilCallback(({ snapshot }) => async () => {
    if (!auction.auctionData) {
      console.error('Unable to place bid: action data not loaded');
      return;
    }

    const currentBid = auction?.bidData?.bids[0]?.bid || 0;
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

    usmClient = getUSMClient();

    try {
      setAuction({
        isLoading: true
      });

      await usmClient.placeBid(amountInSol, IN_PROGRESS_AUCTION_PUBKEY);
      await loadAuction(true);
      showNotification({
        title: 'Success!',
        message: 'Your bid has been recorded.',
        type: 'success',
        timeout: 4000
      });
    } catch (error) {
      console.error(error);
      showNotification({
        title: 'Error',
        message: 'Failed to placing bid.  Please try again',
        type: 'error'
      });
    } finally {
      setAuction({
        isLoading: false
      });
    }

    loadAuction();
  });
}

export function useConnect() {
  const [, setBalance] = useAccountBalance();
  const showNotification = ui.useShowNotification();
  const updateNetworkStatus = useUpdateNetworkState();

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          updateNetworkStatus({
            networkStatus: web3Constants.networkStatus.CONNECTING
          });

          const solClient = getSolClient();
          const accountAddress = await solClient.connectWallet();
          updateNetworkStatus({
            accountAddress,
            networkStatus: web3Constants.networkStatus.CONNECTED,
            networkId: '',
            isConnected: true
          });

          const usmClient = getUSMClient();
          const balance = await usmClient.getWalletBalance();
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
  const resetAccountBalance = useResetRecoilState(balanceState);
  const updateNetworkState = useUpdateNetworkState();

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          const solClient = getSolClient();
          await solClient.disconnectWallet();

          resetAccountBalance();
          updateNetworkState({
            accountAddress: '',
            networkStatus: web3Constants.networkStatus.NOT_CONNECTED,
            networkId: '',
            isConnected: false
          });
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
