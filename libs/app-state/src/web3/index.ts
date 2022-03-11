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

import * as constants from './constants';

export * as web3Constants from './constants';

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

export const balanceState = atom<IAuctionState['balance']>({
  key: 'balanceState',
  default: undefined
});

// @TODO - remove balance state from auction state
export const auctionState = selector<Partial<IAuctionState>>({
  key: 'auctionState',
  get: ({ get }) => ({
    isLoading: get(auctionIsLoadingState),
    bidData: get(bidDataState),
    auctionData: get(auctionDataState),
    balance: get(balanceState)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(auctionIsLoadingState);
      reset(bidDataState);
      reset(auctionDataState);
      reset(balanceState);
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

    if (newState.balance !== undefined) {
      set(balanceState, newState.balance);
    }
  }
});

export function getSolClient() {
  if (!solClient) {
    solClient = new SolClient();
  }

  return solClient;
}

export function getUsmClient() {
  if (!usmClient) {
    const solClient = getSolClient();
    const connection = new Connection(clusterApiUrl('devnet'));
    usmClient = new USMClient(connection, solClient.wallet as Wallet);
  }

  return usmClient;
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
  const [networkState] = useNetworkState();
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

export function useNetworkState() {
  return useRecoilState(networkState);
}

export function useAuctionLoader() {
  const isConnected = useIsConnected();
  const [prevAuctionData, setAuctionData] = useAuctionState();
  const showNotification = ui.useShowNotification();

  return useRecoilCallback(
    ({ snapshot }) =>
      async (forceRefresh = false) => {
        if (!isConnected || (prevAuctionData.auctionData && !forceRefresh)) {
          return;
        }

        try {
          setAuctionData({
            isLoading: true
          });

          usmClient = getUsmClient();
          const balance = await usmClient.getWalletBalance();
          const auctionData = await usmClient.getAuction(
            IN_PROGRESS_AUCTION_PUBKEY
          );
          const bidData = await usmClient.getAuctionData(
            IN_PROGRESS_AUCTION_PUBKEY
          );

          return setAuctionData({
            isLoading: false,
            balance,
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
    [new Date()]
  );
}

export function usePlaceBid(amountInSol: number) {
  const connect = useConnect();
  const { auction, setAuction, loadAuction } = useLoadAuction();
  const { showModal } = ui.useModal();
  const { showNotification, hideNotification } = ui.useNotification();

  return useRecoilCallback(({ snapshot }) => async () => {
    if (!amountInSol) {
      showModal({
        body: 'Your bid must be greater than the current bid'
      });
      return;
    }

    showNotification({
      type: 'processing',
      message: 'your bid is being processed'
    });

    if (!auction.auctionData && !auction.isLoading) {
      await connect();
      await loadAuction(true);
    }

    usmClient = getUsmClient();

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
  const showNotification = ui.useShowNotification();
  const updateNetworkStatus = useUpdateNetworkState();

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          updateNetworkStatus({
            networkStatus: constants.networkStatus.CONNECTING
          });
          const solClient = getSolClient();
          const accountAddress = await solClient.connectWallet();
          updateNetworkStatus({
            accountAddress,
            networkStatus: constants.networkStatus.CONNECTED,
            networkId: '',
            isConnected: true
          });
        } catch (error) {
          updateNetworkStatus({
            networkStatus: constants.networkStatus.NOT_CONNECTED
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
  const resetAuctionState = useResetRecoilState(auctionState);
  const updateNetworkState = useUpdateNetworkState();

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          const solClient = getSolClient();
          await solClient.disconnectWallet();

          resetAuctionState();
          updateNetworkState({
            accountAddress: '',
            networkStatus: constants.networkStatus.NOT_CONNECTED,
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
