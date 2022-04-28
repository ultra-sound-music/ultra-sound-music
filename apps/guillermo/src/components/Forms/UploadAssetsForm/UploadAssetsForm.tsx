import { useState, useEffect } from 'react';
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

import { AuctionItemProgressStatus, useAddAuctionProgress } from '../../../state/tokens';

import styles from './UploadAssetsForm.scss';

export interface UploadAssetsFormProps {
  setMetadataUrl(s: string): void;
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
  return new File([JSON.stringify(json)], file.name, {
    lastModified: Date.now(),
    type: 'application/json'
  });
}

export function UploadAssetsForm({ setMetadataUrl }: UploadAssetsFormProps) {
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
    let uploadedImage;
    if (image instanceof Blob) {
      const imageBuffer = await image?.arrayBuffer();
      const uploadResults = await upload(imageBuffer, image.type);
      uploadedImage = uploadResults.url;
      setUploadedImageUrl(uploadedImage);
    }

    // @Todo this should only happen AFTER the image has successfully uploaded
    if (metadata instanceof File) {
      const newMetadata = await validateMetadata(metadata, uploadedImage);
      const buffer = await newMetadata.arrayBuffer();
      const uploadResults = await upload(buffer, newMetadata.type);
      setUploadedMetadataUrl(uploadResults.url);
      addAuctionProgress({
        status: AuctionItemProgressStatus.UPLOADED,
        metadataUrl: uploadResults.url
      });
    }
  }

  const [arweaveNetwork] = arweave.useNetwork();
  const [imageUrl, setUploadedImageUrl] = useState<string>();
  const [metadataUrl, setUploadedMetadataUrl] = useState<string>();
  const addAuctionProgress = useAddAuctionProgress();
  const [nftImage, setNftImage] = useState<Blob>();
  const [nftMetadata, setNftMetadata] = useState<Blob>();
  const upload = arweave.useUpload();

  const isConnected = arweaveNetwork.status === 'CONNECTED';
  const enableMint = !!nftImage && !!nftMetadata;

  useEffect(() => {
    if (imageUrl && metadataUrl) {
      setMetadataUrl(metadataUrl);
    }
  }, [metadataUrl, imageUrl]);

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
