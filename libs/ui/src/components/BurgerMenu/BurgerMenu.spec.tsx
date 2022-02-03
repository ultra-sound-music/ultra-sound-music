import { render } from '@testing-library/react';

import BurgerMenu from './BurgerMenu';

describe('BurgerMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BurgerMenu />);
    expect(baseElement).toBeTruthy();
  });
});
