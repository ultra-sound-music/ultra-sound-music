import { render } from '@testing-library/react';

import AuctionContainer from './AuctionContainer';

describe('AuctionContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuctionContainer />);
    expect(baseElement).toBeTruthy();
  });
});
