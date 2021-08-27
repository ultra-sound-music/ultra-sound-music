import * as ActionTypes from '../actionTypes';

export function init({ web3Client }) {
  return {
    type: ActionTypes.INIT_USM,
    data: {
      web3Client
    }
  }
}

export function refresh() {
  return {
    type: ActionTypes.REFRESH
  }
}

export function setActiveArtist({ artistId }) {
  return {
    type: ActionTypes.SET_ACTIVE_ARTIST,
    data: {
      artistId
    }
  };
}

export function setActiveBand({ bandId }) {
  return {
    type: ActionTypes.SET_ACTIVE_BAND,
    data: {
      bandId
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

export function createTrack({ bandId, name, description }) {
  return {
    type: ActionTypes.CREATE_TRACK_REQUEST,
    data: {
      bandId,
      name,
      description
    }    
  };
}

export function addTransaction({ method, key, transactionId, block, status, errorCode, errorMessage }) {
  return {
    type: ActionTypes.ADD_TRANSACTION,
    data: {
      method,
      key,
      transactionId,
      block,
      status,
      errorCode,
      errorMessage
    }
  };
}

export function updateTransaction({ method, key, transactionId, block, status, errorCode, errorMessage }) {
  return {
    type: ActionTypes.UPDATE_TRANSACTION,
    data: {
      method,
      key,
      transactionId,
      block,
      status,
      errorCode,
      errorMessage      
    }
  };
}