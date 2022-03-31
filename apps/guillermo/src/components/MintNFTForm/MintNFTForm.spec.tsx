import { render } from '@testing-library/react';

import MintNFTForm from './MintNFTForm';

describe('MintNFTForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MintNFTForm />);
    expect(baseElement).toBeTruthy();
  });
});
