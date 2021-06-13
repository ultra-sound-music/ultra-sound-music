import { createSelector } from '@reduxjs/toolkit';
import * as Constants from '../../constants';

export function getEntities(state) {
  return state.entities.entities;
}

export const getBands = createSelector(
  getEntities,
  (entities) => entities.filter((entity) => entity.type === Constants.entityTypes.BAND)
);

export const getArtists = createSelector(
  getEntities,
  (entities) => entities.filter((entity) => entity.type === Constants.entityTypes.ARTIST)
);

export const getTRACKS = createSelector(
  getEntities,
  (entities) => entities.filter((entity) => entity.type === Constants.entityTypes.TRACKS)
);