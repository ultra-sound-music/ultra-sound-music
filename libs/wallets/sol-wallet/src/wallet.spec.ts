import { getWalletAdapter } from './wallets';

describe('wallet', () => {
  describe('getWalletAdapter()', () => {
    it('gets a "wallet adapter"', () => {
      const wallet = getWalletAdapter('Phantom');
      expect(wallet).toEqual({
        name: expect.any(String),
        url: expect.any(String),
        icon: expect.any(String),
        adapter: expect.any(Object)
      })
    });
  });
});
