import { render } from '@testing-library/react';

import CollectionStamp from './CollectionStamp';

describe('CollectionStamp', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CollectionStamp />);
    expect(baseElement).toBeTruthy();
  });
});
