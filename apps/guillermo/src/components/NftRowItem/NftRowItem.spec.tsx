import { render } from '@testing-library/react';

import NftRowItem from './NftRowItem';

describe('NftRowItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NftRowItem />);
    expect(baseElement).toBeTruthy();
  });
});
