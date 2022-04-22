import { atom, selector, DefaultValue, useRecoilState, atomFamily } from 'recoil';

import { localStorageEffect } from '../../utils';

// @TODO Use this to store saved NFT Sources
// An NFT source can be one of:
// - image file arweave url (check mimetype + extension)
// - json file arweave url (check mimetype + extension)
// - solana auction address
// - solana mint address
const savedNftSourcesState = atomFamily<string, number>({
  key: 'savedNftSourcesState',
  default: '',
  effects: [localStorageEffect<string>('nftSources')]
});
