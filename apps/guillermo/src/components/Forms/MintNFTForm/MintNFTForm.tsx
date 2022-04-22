import { useState } from 'react';
import {
  FileInputField,
  ImageInputField,
  Form,
  IFormValues,
  FormSubmit,
  IFieldValue,
  IFieldName,
  InputField,
  SelectField
} from '@usm/ui';
import { arweave } from '@usm/app-state';

import styles from './MintNFTForm.scss';

export interface IMintNFTFormProps {
  address?: string;
}

export async function validateMetadata(file: File, uploadedImageUrl?: string) {
  const text = await file.text();
  const json = JSON.parse(text);

  console.log(`validating ${file.name}:`, file);
  console.log('This is the json data:', json);
  console.log('Updating the root and properties.files image path...');

  json.image = uploadedImageUrl;
  json.properties.files.unshift({
    uri: uploadedImageUrl,
    type: 'image/@TODO'
  });

  console.log('The json data has been updated: ', json);
  return new File([JSON.stringify(json)], file.name, { lastModified: Date.now(), type: 'testing' });
}

export function MintNFTForm({ address }: IMintNFTFormProps) {
  function onChange(fieldName: IFieldName, fieldValue: IFieldValue) {
    if (fieldValue instanceof Blob && fieldValue?.size > 1000) {
      if (fieldName === 'image') {
        setNftImage(fieldValue);
      } else if (fieldName === 'metadata') {
        setNftMetadata(fieldValue);
      }
    }
  }

  async function onSubmit({ image, metadata }: IFormValues, buttonName: string) {
    console.log();

    let uploadedImage;
    if (image instanceof Blob) {
      const imageBuffer = await image?.arrayBuffer();
      const uploadResults = await upload(imageBuffer);
      uploadedImage = uploadResults.url;
      // uploadedImage =
      //   'https://arweave.net:443/YnfPPAodKbrGG687wXipHOQ_aZcTQ3btCbEXgtGIWaI?ext=jpeg';
      // // https://arweave.net:443/YnfPPAodKbrGG687wXipHOQ_aZcTQ3btCbEXgtGIWaI?ext=jpeg
      setUploadedImageUrl(uploadedImage);
    }

    // @Todo this should only happen AFTER the image has successfully uploaded
    if (metadata instanceof File) {
      const newMetadata = await validateMetadata(metadata, uploadedImage);
      const buffer = await newMetadata.arrayBuffer();
      const uploadResults = await upload(buffer);
      setUploadedMetadataUrl(uploadResults.url);
    }
  }

  const [arweaveNetwork] = arweave.useNetwork();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>();
  const [uploadedMetadataUrl, setUploadedMetadataUrl] = useState<string>();
  const [nftImage, setNftImage] = useState<Blob>();
  const [nftMetadata, setNftMetadata] = useState<Blob>();
  const upload = arweave.useUpload();

  const isConnected = arweaveNetwork.status === 'CONNECTED';
  const enableMint = !!nftImage && !!nftMetadata;

  return (
    <div className={styles.MintNFTForm}>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <h3>NFT Details</h3>
        <SelectField name='selectAuction' title='Select the NFT you want to auction'></SelectField>

        <InputField
          name='imageUrl'
          label='image Arweave url'
          defaultValue='https://alkdsjfakdsjfald'
          // icon={<Ri24HoursFill />}
        />

        <InputField
          name='metadataUrl'
          label='metadata Arweave url'
          value={uploadedMetadataUrl}
          readOnly={true}
        />

        <InputField
          name='nft'
          label='nft address'
          value={uploadedMetadataUrl}
          readOnly={true}
          disabled={true}
        />
        <InputField
          name='nftMetadata'
          label='nft metadata address'
          value={uploadedMetadataUrl}
          readOnly={true}
          disabled={true}
        />

        <InputField
          name='participationNft'
          label='participation nft address'
          readOnly={true}
          disabled={true}
        />
        <InputField
          name='participationMetadata'
          label='participation metadata address'
          value={uploadedMetadataUrl}
          readOnly={true}
          disabled={true}
        />
        <InputField
          name='alternateAccount'
          label='alternative account owner'
          value={uploadedMetadataUrl}
          readOnly={true}
          disabled={true}
        />
        <FormSubmit isFormDisabled={true}>Create NFT</FormSubmit>
      </Form>
    </div>
  );
}

export default MintNFTForm;
