import { NodeWallet } from '@metaplex/js';
import { web3, Provider } from '@project-serum/anchor';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { USMClient } from '../src';
import { NFT_PUBKEY, TOKEN_MINT_PUBKEY } from './utils';
const { Keypair } = web3;

describe('token', () => {
  let provider;
  let wallet;
  let USM: USMClient;

  beforeAll(async () => {
    const walletKeypair = Keypair.generate();
    provider = new Provider(
      new Connection(clusterApiUrl('devnet')),
      new NodeWallet(walletKeypair),
      {}
    );
    ({ wallet } = provider);
    USM = new USMClient('devnet', wallet);
  });

  it('should return info on a token mint', async () => {
    const mintInfo = await USM.getMint(TOKEN_MINT_PUBKEY);
    expect(mintInfo.decimals).toEqual(0);
  });

  it('should return nft metadata', async () => {
    const metadata = await USM.getMetadata(NFT_PUBKEY);
    expect(metadata.name).toEqual('Pato');
  });
});
