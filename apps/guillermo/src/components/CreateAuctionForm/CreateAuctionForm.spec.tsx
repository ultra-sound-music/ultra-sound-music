import { render } from '@testing-library/react';

import CreateAuctionForm from './CreateAuctionForm';

describe('CreateAuctionForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateAuctionForm />);
    expect(baseElement).toBeTruthy();
  });
});
