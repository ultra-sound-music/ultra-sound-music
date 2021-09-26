import { ITraitDefinition } from '@uiTypes';

export interface ILandingProps {
  activeArtistName: string;
  activeArtistTraits: ITraitDefinition[];
  ownsAnArtist: boolean;
  ownsABand: boolean;
  totalArtists: number;
  totalArtistsMinted: number;
}
