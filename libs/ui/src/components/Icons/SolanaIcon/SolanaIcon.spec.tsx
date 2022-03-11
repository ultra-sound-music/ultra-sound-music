import { render } from '@testing-library/react';

import SolanaIcon from './SolanaIcon';

describe('SolanaIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SolanaIcon />);
    expect(baseElement).toBeTruthy();
  });
});
