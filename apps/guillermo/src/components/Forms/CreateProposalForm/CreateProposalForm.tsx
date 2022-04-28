import { useState } from 'react';

import {
  Button,
  FileInputField,
  ImageInputField,
  IteratorFields,
  Form,
  IFormValues,
  FormSubmit,
  IFieldValue,
  IFieldName,
  InputField,
  SelectField,
  Accordion
} from '@usm/ui';

import { createArray } from '@usm/util-utils';

import styles from './CreateProposalForm.scss';
import { VaultInstructions } from '@metaplex-foundation/mpl-token-vault';

export interface CreateProposalFormProps {
  address?: string;
}

export async function validateMetadata(file: File, uploadedImageUrl?: string) {}

export function CreateProposalForm({ address }: CreateProposalFormProps) {
  function renderIteratorFields(index: number) {
    if (!Number.isInteger(index)) {
      return null;
    }

    return (
      <div>
        <InputField name={`governance${index}`} label='governance' />
        <InputField name={`oldUpTime${index}`} label='hold up time' />
        <InputField name={`instruction${index}`} label='instruction' />
      </div>
    );
  }

  function onChange(fieldName: IFieldName, fieldValue: IFieldValue) {
    console.log();
  }

  async function onSubmit(values: IFormValues, buttonName: string) {
    console.log();
  }

  async function onAddInstructionClick() {
    setsInstructionCount(instructionCount + 1);
  }

  const [instructionCount, setsInstructionCount] = useState<number>(0);

  return (
    <Form onSubmit={onSubmit} onChange={onChange}>
      <InputField name='title' label='title' />
      <InputField name='description' label='description' />
      {/* <IteratorFields count={instructionCount} renderFields={renderIteratorFields} /> */}

      <hr />
      <InputField name={`governance[0]`} label='governance' />
      <InputField name={`oldUpTime[0]`} label='hold up time' />
      <InputField name={`instruction[0]`} label='instruction' />
      <hr />

      <InputField name={`governance[1]`} label='governance' />
      <InputField name={`oldUpTime[1]`} label='hold up time' />
      <InputField name={`instruction[1]`} label='instruction' />
      <hr />

      <InputField name={`governance[2}`} label='governance' />
      <InputField name={`oldUpTime[2}`} label='hold up time' />
      <InputField name={`instruction[2]`} label='instruction' />
      <hr />

      <Button onClick={onAddInstructionClick}>Add Instruction</Button>
      <FormSubmit>Submit Proposal</FormSubmit>
    </Form>
  );
}

export default CreateProposalForm;
