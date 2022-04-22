import { atom, useRecoilState, useRecoilValue, atomFamily, selectorFamily } from 'recoil';
import { USMAuctionData } from '@usm/sol-client';
import configs from '@usm/config';

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
export type LoadingState = 'ready' | 'loading' | 'loaded' | 'errored' | undefined;

export const auctionDataByAddressState = atomFamily<USMAuctionData, AccountAddress>({
  key: 'solAuction/auctionDataByAddressState',
  default: undefined
});

export const auctionDataState = selectorFamily<
  [USMAuctionData | undefined, LoadingState],
  AccountAddress
>({
  key: 'solAuction/auctionDataState',
  get:
    (auctionAddress: AccountAddress) =>
    ({ get }) =>
      [
        get(auctionDataByAddressState(auctionAddress)),
        get(auctionLoadingByAddressState(auctionAddress))
      ]
});

export const auctionLoadingByAddressState = atomFamily<LoadingState, AccountAddress>({
  key: 'solAuction/auctionLoadingByAddress',
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
  return useRecoilValue(auctionDataState(auctionAddress));
}

export function useSetAuction(auctionAddress: AccountAddress) {
  return useRecoilValue(auctionDataByAddressState(auctionAddress));
}

export function useAuctionLoadingState(auctionAddress: AccountAddress) {
  return useRecoilState(auctionDataByAddressState(auctionAddress));
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
