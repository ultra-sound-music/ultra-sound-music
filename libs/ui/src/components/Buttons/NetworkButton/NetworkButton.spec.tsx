import { render } from '@testing-library/react';

import NetworkButton from './NetworkButton';

describe('NetworkButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NetworkButton />);
    expect(baseElement).toBeTruthy();
  });
});
