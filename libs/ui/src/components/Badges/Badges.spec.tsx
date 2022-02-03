import { render } from '@testing-library/react';

import Badges from './Badges';

describe('Badges', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Badges />);
    expect(baseElement).toBeTruthy();
  });
});
