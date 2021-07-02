import * as ActionTypes from '../actionTypes';

export function init({ provider }) {
  return {
    type: ActionTypes.INIT_USM,
    data: {
      provider      
    }
  }
}

export function refresh() {
  return {
    type: ActionTypes.REFRESH
  }
}

export function setActiveArtist({ artistTokenId }) {
  return {
    type: ActionTypes.SET_ACTIVE_ARTIST,
    data: {
      artistTokenId
    }
  };
}

export function fetchAllTokens() {
  return {
    type: ActionTypes.FETCH_TOKENS_REQUEST
  };
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

export function startBand({ name, description }) {
  return {
    type: ActionTypes.START_BAND_REQUEST,
    data: {
      name,
      description
    }    
  };
}

export function joinBand({ bandId }) {
  return {
    type: ActionTypes.JOIN_BAND_REQUEST,
    data: {
      bandId
    }    
  }
}

export function createTrack({bandId, name, description}) {
  return {
    type: ActionTypes.CREATE_TRACK_REQUEST,
    data: {
      bandId,
      name,
      description
    }    
  };
}