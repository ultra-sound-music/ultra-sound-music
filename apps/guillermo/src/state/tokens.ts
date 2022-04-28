import { atom, useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { localStorageEffect } from '@usm/app-state';

export enum AuctionItemProgressStatus {
  UPLOADED_ART_ONLY,
  UPLOADED,
  PROPOSAL_SUBMITTED,
  MINTED,
  AUCTION_CREATED
}

export interface AuctionItemProgress {
  status: AuctionItemProgressStatus;
  metadataUrl?: string;
  mintAddress?: string;
  auctionAddress?: string;
  proposalAddress?: string;
  uploadedDate?: EpochTimeStamp;
  lastModified?: EpochTimeStamp;
  editors?: string[];
}

export const auctionsProgressState = atom<AuctionItemProgress[]>({
  key: 'guillermo/auctionsProgressState',
  default: undefined,
  effects: [localStorageEffect<AuctionItemProgress[]>('admin.auctionsProgress')]
});

export function useAuctionsProgress() {
  return useRecoilValue(auctionsProgressState);
}

export function useAddAuctionProgress() {
  const setter = useSetRecoilState(auctionsProgressState);
  return (newItem: AuctionItemProgress) => {
    setter((collection) => [...collection, newItem]);
  };
}
