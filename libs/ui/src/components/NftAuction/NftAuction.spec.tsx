import { render } from '@testing-library/react';

import NftAuction from './NftAuction';

describe('NftAuction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NftAuction />);
    expect(baseElement).toBeTruthy();
  });
});
