import { useState } from 'react';
import JsonEditor from 'jsoneditor';

import {
  FileInputField,
  ImageInputField,
  Form,
  IFormValues,
  FormSubmit,
  IFieldValue,
  IFieldName
} from '@usm/ui';
import { arweave } from '@usm/app-state';
import { ArweaveButton } from '@usm/components';

import styles from './UploadAssetsForm.scss';

export interface UploadAssetsFormProps {
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

export function UploadAssetsForm({ address }: UploadAssetsFormProps) {
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
  const [imageUrl, setUploadedImageUrl] = useState<string>();
  const [metadataUrl, setUploadedMetadataUrl] = useState<string>();
  const [nftImage, setNftImage] = useState<Blob>();
  const [nftMetadata, setNftMetadata] = useState<Blob>();
  const upload = arweave.useUpload();

  const isConnected = arweaveNetwork.status === 'CONNECTED';
  const enableMint = !!nftImage && !!nftMetadata;

  return (
    <div className={styles.UploadAssetsForm}>
      <Form onSubmit={onSubmit} onChange={onChange}>
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

        {isConnected ? (
          <FormSubmit name='save'>Save</FormSubmit>
        ) : (
          <div className={styles.arweaveConnectButton}>
            <ArweaveButton />
          </div>
        )}

        {isConnected && (
          <FormSubmit name='mint' isFormDisabled={!enableMint}>
            Upload
          </FormSubmit>
        )}
      </Form>
      <div>image: {imageUrl}</div>
      <div>metadata: {metadataUrl}</div>
    </div>
  );
}

export default UploadAssetsForm;
