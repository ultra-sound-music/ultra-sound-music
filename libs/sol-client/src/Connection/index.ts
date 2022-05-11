import { clusterApiUrl, Connection, Commitment, Cluster } from '@solana/web3.js';

export { Connection };
export type { Cluster };

export type RpcEndpoint = Cluster | string;
export type ConnectionConfig = {
  rpcEndpoint: RpcEndpoint;
  commitment?: Commitment;
};

export type ConnectionConfigOrEndpoint = RpcEndpoint | ConnectionConfig;

export function createRpcConnection(config: ConnectionConfigOrEndpoint): Connection {
  const { rpcEndpoint, commitment = 'processed' }: ConnectionConfig =
    typeof config === 'string' ? { rpcEndpoint: config } : config;
  const endpoint = rpcEndpoint?.startsWith('http')
    ? rpcEndpoint
    : clusterApiUrl(rpcEndpoint as Cluster);

  return new Connection(endpoint, commitment);
}
