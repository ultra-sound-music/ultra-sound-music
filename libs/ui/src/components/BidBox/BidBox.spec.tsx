import { render } from '@testing-library/react';

import BidBox from './BidBox';

describe('BidBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BidBox />);
    expect(baseElement).toBeTruthy();
  });
});
