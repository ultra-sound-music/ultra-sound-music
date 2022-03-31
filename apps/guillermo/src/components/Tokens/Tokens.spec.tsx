import { render } from '@testing-library/react';

import Tokens from './Tokens';

describe('Tokens', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tokens />);
    expect(baseElement).toBeTruthy();
  });
});
