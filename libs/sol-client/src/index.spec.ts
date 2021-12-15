import { IWallet } from '@usm/wallets/types';
import { mock } from 'jest-mock-extended';

import SolClient from './index';

describe('SolClient', () => {
  describe('SolClient() constructor', () => {
    it('creats a SolClient instance', () => {
      const wallet = mock<IWallet>();
      const accountAddress = '';
      expect(
        new SolClient({
          wallet,
          accountAddress,
        })
      ).toBeInstanceOf(SolClient);
    });
  });
});
