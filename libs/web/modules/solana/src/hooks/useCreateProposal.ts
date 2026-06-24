import { useRecoilCallback } from 'recoil';

import { TransactionsBatch, Transaction } from 'libs/shared/sol-client/src';

// import { createProposal } from '../api';
import { useNotification } from '../../../../../modules/ui/src';

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
          // return await createProposal({
          //   payer: daoTreasury,
          //   owner: nftOwner,
          //   name,
          //   transaction,
          //   description
          // });
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
