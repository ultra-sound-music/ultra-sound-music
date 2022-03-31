import { Form, SelectField, InputListField, FormSubmit } from '@usm/ui';
import styles from './CreateAuctionForm.scss';

export function CreateAuctionForm() {
  function onSubmit() {
    console.log();
  }

  return (
    <div className={styles.CreateAuctionForm}>
      <Form onSubmit={onSubmit}>
        <SelectField
          name='nft'
          label='NFT for Auction'
          title='Select the NFT you want to auction'
        />
        <InputListField name='creators' label='creators' title='Add creators to whitelist' />
        <FormSubmit name='save'>save</FormSubmit>
        <FormSubmit name='create'>create</FormSubmit>
      </Form>
    </div>
  );
}

export default CreateAuctionForm;
