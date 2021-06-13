import { ethers } from 'ethers';
import { debug } from 'tone';

const methods = {
  CONNECT_WALLET: 'eth_requestAccounts',
  GET_CHAIN_ID: 'eth_chainId'
}

let provider = null;
let signer = null;
const ethereum = window.ethereum ?? null;
const web3IsAvailable = !!ethereum;

export async function initialize() {
  if (!web3IsAvailable) {
    return null;
  }

  provider = new ethers.providers.Web3Provider(ethereum);
  return getConnectedAccount();
}

export function bindCoreEventListeners(emit, ethereum, listeners = {}) {
  return Object.keys(listeners).reduce((boundEventListeners, eventName) => {
    const handler = (...args) => {
      const getAction = listeners[eventName];
      const action = getAction(...args);
      emit(action)
    };
    ethereum.on(eventName, handler);
    boundEventListeners[eventName] = handler;
    return boundEventListeners;
  }, {});
}

export function removeCoreEventListeners(listeners = {}) {
  Object.keys(listeners).forEach((eventName) => {
    ethereum.removeListener(eventName, listeners[eventName]);
  });
}

export async function getConnectedAccount() {
  if (!provider) {
    return null;
  }

  const accounts = await provider.listAccounts();
  return accounts?.[0] ?? null;
}

export async function isConnected() {
  if (!provider) {
    return false;
  }

  return !!getConnectedAccount();
}

export async function installWallet() {
  return Promise.resolve('@TODO success @TODO');
}

export async function connectWallet() {
  if (!ethereum) {
    return '';
  }

  const accounts = await provider.send('eth_requestAccounts');
  return accounts[0] ?? '';
}

export async function getChainId() {
  if (!ethereum) {
    return '';
  }
  
  return ethereum.request({ method: methods.GET_CHAIN_ID });
}

export function getEthereumProvider() {
  return ethereum;
}

export async function createArtist() {

}

export async function createBand() {
  
}

export async function joinBand() {
  
}

export async function createTrack() {
  
}