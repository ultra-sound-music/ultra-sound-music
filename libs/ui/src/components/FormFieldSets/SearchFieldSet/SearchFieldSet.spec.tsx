import { render } from '@testing-library/react';

import SearchFieldSet from './SearchFieldSet';

describe('SearchFieldSet', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchFieldSet name='testSearch' />);
    expect(baseElement).toBeTruthy();
  });
});
