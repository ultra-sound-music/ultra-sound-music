export interface IConfigsState {
  lfg: boolean;
  isArtistOnly: boolean;
}

export interface IRootState {
  configs: IConfigsState;
  [key: string]: unknown | Record<string, unknown>;
}
