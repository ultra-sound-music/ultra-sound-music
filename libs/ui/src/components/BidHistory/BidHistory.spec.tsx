import { render } from '@testing-library/react';

import BidHistory from './BidHistory';

describe('BidHistory', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BidHistory />);
    expect(baseElement).toBeTruthy();
  });
});
