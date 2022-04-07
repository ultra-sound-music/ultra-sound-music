import { Connection, PublicKey } from '@solana/web3.js';

import { withTransactionInterface } from '../utils';
import { Wallet } from '../Wallet';

export function redeemParticipationBid(connection: Connection, wallet: Wallet, auction: PublicKey) {
  return withTransactionInterface(connection, { txId: '' });
}
