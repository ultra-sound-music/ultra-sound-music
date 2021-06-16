import * as ActionTypes from '../actionTypes';

export function setWallet({address}) {
  return {
    type: ActionTypes.SET_WALLET,
    data: {
      address
    }
  };
}
