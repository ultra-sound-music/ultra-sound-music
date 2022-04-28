import { useRecoilCallback } from 'recoil';
import { useNotification } from '../../../ui';
import { mintNft, createMintNftTransaction } from '../api';

export function useMintNft() {
  const { showNotification } = useNotification();

  return useRecoilCallback(
    () =>
      async (
        metadataUri: string,
        nftOwner: string,
        daoTreasury: string,
        isParticipationNft: boolean
      ) => {
        if (daoTreasury && nftOwner) {
          showNotification({
            title: 'processing',
            message: 'Creating mint NFT instructions',
            timeout: true
          });

          const results = await createMintNftTransaction({
            metadataUri,
            isParticipationNft,
            owner: nftOwner,
            payer: daoTreasury
          });
          return {
            mint: results?.mintPk.toBase58(),
            metadata: results?.metadataPk.toBase58(),
            transaction: results?.transaction
          };
        }

        showNotification({
          title: 'processing',
          message: 'Mint NFT',
          timeout: true
        });

        const apiResult = await mintNft({
          metadataUri,
          isParticipationNft
        });

        await apiResult?.confirmTransaction();
        return {
          mint: apiResult?.data?.mintPk.toBase58(),
          metadata: apiResult?.data?.metadataPk.toBase58(),
          transaction: apiResult?.data?.transaction
        };
      }
  );
}
