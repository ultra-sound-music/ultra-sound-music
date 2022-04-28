import * as solClient from '@usm/sol-client';

import { getWallet, getConnection } from '../registry';

export interface CreateMintNftTransactionArgs {
  metadataUri: string;
  isParticipationNft: boolean;
  owner: string;
  payer: string;
}

export async function createMintNftTransaction({
  metadataUri,
  isParticipationNft,
  owner,
  payer
}: CreateMintNftTransactionArgs) {
  const connection = getConnection();

  return solClient.createMintNftTransaction({
    connection,
    creator: new solClient.PublicKey(owner),
    payer: new solClient.PublicKey(payer),
    uri: metadataUri,
    maxSupply: isParticipationNft ? undefined : 1
  });
}

export async function mintNft({
  metadataUri,
  isParticipationNft
}: {
  metadataUri: string;
  isParticipationNft: boolean;
}) {
  const wallet = await getWallet();
  const connection = getConnection();

  if (isParticipationNft) {
    return solClient.mintParticipationNft({
      connection,
      wallet: wallet as solClient.MplWallet,
      metadataUri
    });
  }

  return solClient.mintNft({
    connection,
    wallet: wallet as solClient.MplWallet,
    metadataUri
  });
}
