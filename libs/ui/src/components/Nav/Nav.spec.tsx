import { render } from '@testing-library/react';

import Nav from './Nav';

describe('Nav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Nav items={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
