import { atom, useRecoilState, atomFamily } from 'recoil';
import { USMAuctionData, TransactionInterface } from '@usm/sol-client';

import { NotificationState } from '../../../ui';
import configs from '@usm/config';

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

export type AuctionAddress = string;
export type LoadingState = 'ready' | 'loading' | 'loaded' | 'errored' | undefined;

const auctions = configs.mplAuctionPubKeys || [configs.mplAuctionPubKey] || [];

export const auctionDataState = atomFamily<USMAuctionData | undefined, AuctionAddress | undefined>({
  key: 'solAuction/auctionDataState',
  default: undefined
});

export const auctionLoadingState = atomFamily<LoadingState, AuctionAddress | undefined>({
  key: 'solAuction/auctionLoadingStateFamily',
  default: undefined
});

export const auctionSortState = atom<AuctionAddress[]>({
  key: 'solAuction/auctionSortState',
  default: auctions
});

export const selectedAuctionState = atom<AuctionAddress>({
  key: 'solAuction/selectedAuctionState',
  default: auctions[3]
});

export const activeAuctionState = atom<AuctionAddress>({
  key: 'solAuction/activeAuctionState',
  default: auctions[3]
});

export function useAuction(auctionAddress: AuctionAddress) {
  return useRecoilState(auctionDataState(auctionAddress));
}

export function useAuctionLoadingState(auctionAddress: AuctionAddress) {
  return useRecoilState(auctionLoadingState(auctionAddress));
}

export function useSelectedAuction() {
  return useRecoilState(selectedAuctionState);
}

export function useActiveAuction() {
  return useRecoilState(activeAuctionState);
}
