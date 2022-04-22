import { render } from '@testing-library/react';

import MintNFTForm from './UploadAssetsForm';

describe('MintNFTForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MintNFTForm />);
    expect(baseElement).toBeTruthy();
  });
});
