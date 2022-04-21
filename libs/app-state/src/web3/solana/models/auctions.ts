import { atom, useRecoilState, useRecoilValue, atomFamily } from 'recoil';
import { USMAuctionData, TransactionInterface } from '@usm/sol-client';
import configs from '@usm/config';

import { NotificationState } from '../../../ui';
import { getAuctionAddresses } from '../registry';
import { AccountAddress } from '../types';

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
  updater(): Promise<TransactionInterface>;
  processingMessage: string;
  successMessage: string;
  confirmedMessage: string;
  errorMessage: string;
  loadAuction(b: boolean): Promise<void>;
  showNotification(args: NotificationState): void;
}

export type LoadingState = 'ready' | 'loading' | 'loaded' | 'errored' | undefined;

export const auctionDataState = atomFamily<USMAuctionData | undefined, AccountAddress | undefined>({
  key: 'solAuction/auctionDataState',
  default: undefined
});

export const auctionLoadingState = atomFamily<LoadingState, AccountAddress | undefined>({
  key: 'solAuction/auctionLoadingStateFamily',
  default: undefined
});

export const auctionSortState = atom<AccountAddress[]>({
  key: 'solAuction/auctionSortState',
  default: configs.mplAuctionPubKeys
});

export const selectedAuctionState = atom<AccountAddress>({
  key: 'solAuction/selectedAuctionState',
  default: configs.mplAuctionPubKeys[0]
});

export const activeAuctionState = atom<AccountAddress>({
  key: 'solAuction/activeAuctionState',
  default: configs.mplAuctionPubKeys[0]
});

export function useAuction(auctionAddress: AccountAddress) {
  return useRecoilState(auctionDataState(auctionAddress));
}

export function useAuctionLoadingState(auctionAddress: AccountAddress) {
  return useRecoilState(auctionLoadingState(auctionAddress));
}

export function useSelectedAuction() {
  return useRecoilState(selectedAuctionState);
}

export function useGetAuctions() {
  return useRecoilValue(auctionSortState);
}

export function useActiveAuction() {
  return useRecoilState(activeAuctionState);
}
