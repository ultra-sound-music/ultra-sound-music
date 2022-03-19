import { render } from '@testing-library/react';

import EndedAuctionButton from './EndedAuctionButton';

describe('EndedAuctionButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EndedAuctionButton />);
    expect(baseElement).toBeTruthy();
  });
});
