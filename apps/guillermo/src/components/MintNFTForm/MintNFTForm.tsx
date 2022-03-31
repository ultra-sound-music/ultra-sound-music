import { FileInputField, ImageInputField, Form, IFormValues, FormSubmit } from '@usm/ui';
import { useArweaveNetwork } from '@usm/app-state';
import { ArweaveButton } from '@usm/components';

import styles from './MintNFTForm.scss';

export interface IMintNFTFormProps {
  address?: string;
}

export function MintNFTForm({ address }: IMintNFTFormProps) {
  const [arweaveNetwork, setArweaveNetwork] = useArweaveNetwork();

  function onSubmit(values: IFormValues, buttonName: string) {
    console.log();
  }

  return (
    <div className={styles.MintNFTForm}>
      <Form onSubmit={onSubmit}>
        <ImageInputField
          id='nftImage'
          name='image'
          label='Choose a file...'
          title='Provide an image for your NFT (.png or .jpg)'
          accept='image/png, image/jpeg'
        />
        <FileInputField
          id='nftMetadata'
          name='metadata'
          label='Choose a file...'
          title='Provide a metadata file for your NFT (.json)'
          accept='.json'
        />
        {arweaveNetwork.isConnected ? (
          <FormSubmit name='save'>Save</FormSubmit>
        ) : (
          <div className={styles.arweaveConnect}>
            <ArweaveButton />
          </div>
        )}

        {arweaveNetwork.isConnected && <FormSubmit name='mint'>Mint</FormSubmit>}
      </Form>
    </div>
  );
}

export default MintNFTForm;
