import { render } from '@testing-library/react';

import InputFieldSet from './InputFieldSet';

describe('InputFieldSet', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputFieldSet name='testInput' />);
    expect(baseElement).toBeTruthy();
  });
});
