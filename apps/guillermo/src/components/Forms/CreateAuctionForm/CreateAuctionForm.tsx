import { Form, InputListField, InputField, FormSubmit } from '@usm/ui';
import styles from './CreateAuctionForm.scss';

export function CreateAuctionForm() {
  function onSubmit() {
    console.log();
  }

  return (
    <div className={styles.CreateAuctionForm}>
      <Form onSubmit={onSubmit}>
        <InputListField name='creators' label='creators' />

        <InputField name='creators' label='tick size' />

        <InputField name='creators' label='auction start' />

        <InputField name='creators' label='auction end' />

        <InputField name='store' label='store address' readOnly={true} />

        <InputField name='vault' label='vault address' readOnly={true} />

        <InputField name='primaryTokenStore' label='primary token store' readOnly={true} />

        <InputField
          name='participationTokenStore'
          label='participation token store'
          readOnly={true}
        />

        <InputField name='auction' label='auction address' readOnly={true} />

        <InputField name='auctionManager' label='auction manager address' readOnly={true} />

        <FormSubmit name='save'>save</FormSubmit>
        <FormSubmit name='create'>create auction</FormSubmit>
      </Form>
    </div>
  );
}

export default CreateAuctionForm;
