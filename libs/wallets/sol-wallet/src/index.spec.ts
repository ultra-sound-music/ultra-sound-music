import SolWallet from './index';

describe('SolWallet', () => {
  describe('SolWallet constructor', () => {
    it('creats a SolWallet instance', () => {
      const wallet = new SolWallet('Phantom');
      expect(wallet).toBeInstanceOf(SolWallet);
    });
  });
});
