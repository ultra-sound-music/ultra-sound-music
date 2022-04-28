import { PublicKey, Keypair } from '@solana/web3.js';
import { Transaction } from '@usm/sol-client';
import { useEffect, useState } from 'react';
import { Button, Form, IFormValues, FormSubmit, InputField, CheckboxField } from '@usm/ui';
import { solana } from '@usm/app-state';
import configs from '@usm/config';

import styles from './MintNFTForm.scss';
import { TransactionsBatch } from '@metaplex/js/lib/utils/transactions-batch';

export type MintNftResultData = {
  mint: solana.AccountAddress;
  metadata: solana.AccountAddress;
  transaction?: Transaction;
};

export interface MintNFTFormProps {
  metadataUrl?: string;
}

const { useNetworkStatus, useMintNft, useCreateProposal, getWallet } = solana;

export async function validateMetadata() {
  // THIS just needs to make sure the metadata has what we want before minting
}

export function MintNFTForm({ metadataUrl }: MintNFTFormProps) {
  function loadImageUrl(metadata: string) {
    return fetch(metadata)
      .then((response) => response.json())
      .then((metadata) => {
        const url = metadata.image;
        const isInFilesArray =
          url &&
          typeof url === 'string' &&
          metadata?.properties?.files?.find((f: { uri: string }) => f.uri === url);

        if (isInFilesArray) {
          return url;
        } else {
          throw new Error('Invalid metadata');
        }
      });
  }

  async function onExecuteTransaction() {}

  async function onSubmit({
    nftOwner,
    daoTreasury,
    metadataUrl,
    isParticipationNft = false
  }: IFormValues) {
    setIsProcessing(true);
    const wallet = await getWallet();

    // test with my wallet instead
    daoTreasury = wallet.publicKey.toBase58();

    const { mint, metadata, transaction } = await mintNft(
      metadataUrl as string,
      nftOwner as string,
      daoTreasury as string,
      isParticipationNft as boolean
    );

    setNft(mint);
    setMetadata(metadata);
    setTransaction(JSON.stringify(transaction));

    if (!daoTreasury) {
      setIsProcessing(false);
      return;
    }

    console.log('daoTreasury: ', daoTreasury);
    console.log('nftOwner: ', nftOwner);
    console.log('new mint: ', mint);

    const newProposalPk = await createProposal(
      daoTreasury as string,
      nftOwner as string,
      transaction as TransactionsBatch,
      'Mint an NFT',
      `Proposal to mint NFT: [mint](https://explorer.solana.com/address/${mint}?cluster=devnet) * [metadata url](${metadataUrl})`
    );

    console.log('new proposal: ', newProposalPk?.toBase58());
    console.log(
      'new mint address: ',
      (transaction as TransactionsBatch)?.signers?.[0].publicKey.toBase58()
    );
    console.log(
      'new mint secret: ',
      (transaction as TransactionsBatch)?.signers?.[0].secretKey.toString()
    );

    setProposalPk(newProposalPk);
    setSigners(transaction ? (transaction as TransactionsBatch).signers : undefined);
    setIsProcessing(false);
  }

  const [networkStatus] = useNetworkStatus();
  const mintNft = useMintNft();
  const createProposal = useCreateProposal();

  useEffect(() => {
    if (metadataUrl) {
      loadImageUrl(metadataUrl).then((url) => setImageUrl(url));
    }
  }, [metadataUrl]);

  const [proposalPk, setProposalPk] = useState<PublicKey>();
  const [signers, setSigners] = useState<Keypair[]>();
  const [isProcessing, setIsProcessing] = useState<boolean>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [nft, setNft] = useState<string>();
  const [metadata, setMetadata] = useState<string>();
  const [transaction, setTransaction] = useState<string>();

  const ready = !!metadataUrl && !!imageUrl;
  const isConnected = networkStatus === 'CONNECTED';
  const isFormDisabled = !ready || !isConnected;

  return (
    <div className={styles.MintNFTForm}>
      <Form onSubmit={onSubmit} isLoading={isProcessing}>
        <h3>NFT Details</h3>
        <CheckboxField name='isParticipationNft' label='is participation nft?' />
        <InputField
          name={ready ? 'imageUrl' : ''}
          label='image Arweave url'
          defaultValue={imageUrl}
          required={true}
          readOnly={true}
        />

        <InputField
          name={ready ? 'metadataUrl' : ''}
          label='metadata Arweave url'
          defaultValue={metadataUrl}
          required={true}
          readOnly={true}
        />

        <InputField name={'nftOwner'} label='NFT Owner' defaultValue={configs.jamBotsGovernance} />

        <InputField name={'daoTreasury'} label='DAO Treasury' defaultValue={configs.daoTreasury} />

        <FormSubmit isFormDisabled={isFormDisabled}>Create NFT</FormSubmit>
      </Form>
      <div>
        <Button onClick={onExecuteTransaction}>Execute Transaction</Button>
        <div>mint: {nft}</div>
        <div>metadata: {metadata}</div>
        <div>transaction: {transaction}</div>
      </div>
    </div>
  );
}

export default MintNFTForm;
