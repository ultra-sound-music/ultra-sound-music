import { render } from '@testing-library/react';

import SolanaFMProvider from './SolanaFMProvider';

describe('SolanaFMProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SolanaFMProvider />);
    expect(baseElement).toBeTruthy();
  });
});
