import { useRecoilCallback } from 'recoil';

import { TransactionsBatch, Transaction } from '@usm/sol-client';

import { createProposal } from '../api';
import { useNotification } from '../../../ui';

export function useCreateProposal() {
  const { showNotification } = useNotification();

  return useRecoilCallback(
    () =>
      async (
        daoTreasury: string,
        nftOwner: string,
        transaction: Transaction | TransactionsBatch,
        name: string,
        description: string
      ) => {
        showNotification({
          title: 'processing',
          message: 'Creating mint NFT instructions',
          timeout: true
        });

        try {
          return await createProposal({
            payer: daoTreasury,
            owner: nftOwner,
            name,
            transaction,
            description
          });
        } catch (error) {
          console.error(error);
          showNotification({
            title: 'Error',
            message: 'Failed to create proposal',
            timeout: true
          });
        }
      }
  );
}
