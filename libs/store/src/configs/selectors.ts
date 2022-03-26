import { IRootState } from '@usm/store/types';

export const getLfg = (state: IRootState): boolean => state.configs.lfg;
export const getIsArtistOnly = (state: IRootState): boolean => state.configs.isArtistOnly;
