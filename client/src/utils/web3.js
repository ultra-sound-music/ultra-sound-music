import { ethers } from 'ethers';

const methods = {
  CONNECT_WALLET: 'eth_requestAccounts',
  GET_CHAIN_ID: 'eth_chainId'
}

let provider = null;
const ethereum = window.ethereum ?? null;
const isWeb3sAvailable = !!ethereum;

export async function initialize() {
  if (!isWeb3sAvailable) {
    return null;
  }

  provider = new ethers.providers.Web3Provider(ethereum);
  return getConnectedAccount();
}

export function getProvider() {
  return provider;
}

export function getIsWeb3sAvailable() {
  return isWeb3sAvailable;
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

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
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

export function genCreateArtistTransactionKey(accountAddress) {
  return `${accountAddress}-creates-arstist`;
}

export function genStartBandTransactionKey(artistId) {
  return `${artistId}-starts-band`;
}

export function genJoinBandTransactionKey(bandId, artistId) {
  return `${artistId}-joins-${bandId}`;
}

export function genCreateTrackTransactionKey(bandId, artistId) {
  return `${bandId}-${artistId}-creates-track`;
}