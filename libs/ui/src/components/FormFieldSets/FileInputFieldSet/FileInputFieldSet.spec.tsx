import { render } from '@testing-library/react';

import FileInputFieldSet from './FileInputFieldSet';

describe('FileInputFieldSet', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FileInputFieldSet />);
    expect(baseElement).toBeTruthy();
  });
});
