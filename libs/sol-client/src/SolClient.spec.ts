import { solClient } from './lib/SolClient';

describe('solClient', () => {
  it('should work', () => {
    expect(solClient()).toEqual('sol-client');
  });
});
