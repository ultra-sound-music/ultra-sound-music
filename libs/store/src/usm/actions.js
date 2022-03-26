import * as ActionTypes from './actionTypes';

export function init({ web3Client }) {
  return {
    type: ActionTypes.INIT_USM,
    data: {
      web3Client
    }
  };
}

export function fetchNewMints() {
  return {
    type: ActionTypes.FETCH_NEW_MINTS_REQUEST
  };
}

export function fetchNewMintsSuccess({ mints }) {
  return {
    type: ActionTypes.FETCH_NEW_MINTS_SUCCESS,
    payload: {
      mints
    }
  };
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

export function fetchAllTokens({ pendingTransactionType, pendingMetadataUri } = {}) {
  return {
    type: ActionTypes.FETCH_TOKENS_REQUEST,
    data: {
      pendingTransactionType,
      pendingMetadataUri
    }
  };
}

export function fetchTokensComplete({ tokens }) {
  return {
    type: ActionTypes.FETCH_TOKENS_COMPLETE,
    data: {
      tokens
    }
  };
}

export function createArtist({ imageUrl }) {
  return {
    type: ActionTypes.CREATE_ARTIST_REQUEST,
    data: {
      imageUrl
    }
  };
}

export function startBand() {
  return {
    type: ActionTypes.START_BAND_REQUEST
  };
}

export function joinBand({ bandId }) {
  return {
    type: ActionTypes.JOIN_BAND_REQUEST,
    data: {
      bandId
    }
  };
}

export function createTrack({ bandId }) {
  return {
    type: ActionTypes.CREATE_TRACK_REQUEST,
    data: {
      bandId
    }
  };
}

export function addTransaction({ method, key, transactionId, status, errorCode, errorMessage }) {
  return {
    type: ActionTypes.ADD_TRANSACTION,
    data: {
      method,
      key,
      transactionId,
      status,
      errorCode,
      errorMessage
    }
  };
}

export function updateTransaction({ method, key, transactionId, status, errorCode, errorMessage }) {
  return {
    type: ActionTypes.UPDATE_TRANSACTION,
    data: {
      method,
      key,
      transactionId,
      status,
      errorCode,
      errorMessage
    }
  };
}
