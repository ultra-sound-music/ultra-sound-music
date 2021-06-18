import * as ActionTypes from '../actionTypes';

export function init() {
  return {
    type: ActionTypes.INIT_USM
  }
}

export function setTokens({tokens}) {
  return {
    type: ActionTypes.SET_TOKENS,
    data: {
      tokens
    }
  };
}

export function createArtist({name, description}) {
  return {
    type: ActionTypes.CREATE_ARTIST_REQUEST,
    data: {
      name,
      description
    }
  };
}

export function startBand({name, description, bandLeaderTokenId}) {
  return {
    type: ActionTypes.START_BAND_REQUEST,
    data: {
      name,
      description,
      bandLeaderTokenId
    }    
  };
}

export function createTrack({bandTokenId, name, description}) {
  return {
    type: ActionTypes.CREATE_TRACK_REQUEST,
    data: {
      bandTokenId,
      name,
      description
    }    
  };
}