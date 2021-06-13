import * as ActionTypes from '../actionTypes';

export function setWallet({address}) {
  return {
    type: ActionTypes.SET_WALLET,
    data: {
      address
    }
  };
}

export function setTransaction(transactionId) {
  return {
    type: ActionTypes.SET_TRANSACTION,
    data: {
      transactionId      
    }
  };
}

export function setEntities(entities) {
  return {
    type: ActionTypes.SET_ENTITIES,
    data: {
      entities
    }
  };
}


