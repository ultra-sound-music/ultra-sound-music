import { ReactNode, Children, cloneElement, isValidElement } from 'react';

export interface IteratorFieldsProps {
  count: number;
  renderFields(n: number): ReactNode;
}

export function IteratorFields({ count, renderFields }: IteratorFieldsProps) {
  return null;
}

export default IteratorFields;
