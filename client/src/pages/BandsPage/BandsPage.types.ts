import { ITraitDefinition } from '@uiTypes';

export type TBandsPageProps = IBandsPageState & IBandsPageActions;

export interface tempBand {
  name: string;
  members: string[];
  id: string;
  tokenId: string;
}

export interface IBandsPageState {
  bands: tempBand[];
  activeArtistImageUrl: string;
  activeArtistName: string;
  activeArtistId: string;
  activeArtistTraits: ITraitDefinition[];
}

export interface IBandsPageActions {
  showStartBandModal: () => void;
  showJoinBandModal: ({ bandId: string }) => void;
  showMintTrackModal: ({ bandId: string }) => void;
}
