import { useState } from 'react';
import { serializeInstructionToBase64 } from '@solana/spl-governance';

import { Form, FormSubmit, IFormValues, InputField, TextAreaField } from '@usm/ui';

export function Serializer() {
  function onSubmit({ instruction }: IFormValues) {
    const encoded = serializeInstructionToBase64(JSON.parse(instruction as string));
    setEncodedInstruction(encoded);
  }

  const [encodedInstruction, setEncodedInstruction] = useState<string>();

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <TextAreaField name='instruction' label='instruction' />
        <FormSubmit>encode</FormSubmit>
      </Form>
      {encodedInstruction && <div>{encodedInstruction}</div>}
    </div>
  );
}

export default Serializer;
