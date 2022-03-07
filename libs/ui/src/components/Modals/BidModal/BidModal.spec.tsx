import { render } from '@testing-library/react';

import BidModal from './BidModal';

describe('BidModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BidModal />);
    expect(baseElement).toBeTruthy();
  });
});
