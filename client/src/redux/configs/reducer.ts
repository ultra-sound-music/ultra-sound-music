import { createReducer } from '@reduxjs/toolkit';

export interface IConfigsState {
  lfg: boolean;
  isArtistOnly: boolean;
}

const initialState: IConfigsState = {
  lfg: true,
  isArtistOnly: true
};

export default createReducer(initialState, (): IConfigsState => {
  return initialState;
});
