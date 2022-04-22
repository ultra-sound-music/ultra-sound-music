import configs from '@usm/config';

export function getAssetUrl(assetId: string) {
  return `${configs.arweaveProtocol}://${configs.arweaveHost}:${configs.arweavePort}/${assetId}`;
}
