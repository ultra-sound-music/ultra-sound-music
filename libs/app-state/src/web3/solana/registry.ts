import { getWallet as getWalletData, Wallet } from '@usm/sol-client';
import configs from '@usm/config';
import { createRpcConnection, Cluster, Connection } from '@usm/sol-client';

export let wallet: Wallet | undefined;
export async function initWallet() {
  const walletData = getWalletData();
  const pendingWallet = walletData.wallet as NonNullable<Wallet>;
  await pendingWallet.ready();
  wallet = pendingWallet;
  return wallet;
}

export const walletPromise = new Promise<Wallet>((resolve) => {
  const id = setInterval(() => {
    if (wallet) {
      wallet.ready().then(() => {
        resolve(wallet as Wallet);
        clearInterval(id);
      });
    }
  }, 100);
});

export const getWallet = async () => walletPromise;

export let connection: Connection | undefined;
export function initConnection() {
  const cluster = configs.solanaCluster as Cluster;
  connection = createRpcConnection(cluster);
  return connection;
}

export const connectionPromise = new Promise<Connection>((resolve) => {
  const id = setInterval(() => {
    if (connection) {
      resolve(connection);
      clearInterval(id);
    }
  }, 100);
});

export const getConnection = async () => connectionPromise;
