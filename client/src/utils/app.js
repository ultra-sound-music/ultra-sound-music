import constants from '@constants';

export function getCurrentBlockchain() {
  return '__BLOCKCHAIN_NAME__' || '';
}

export function appIsUsingSolana() {
  return getCurrentBlockchain() === constants.web3.blockchain.solana;
}

export function appIsUsingEthereum() {
  return getCurrentBlockchain() === constants.web3.blockchain.ethereum;
}
