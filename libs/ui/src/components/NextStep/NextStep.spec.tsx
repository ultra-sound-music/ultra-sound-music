import { render } from '@testing-library/react';

import NextStep from './NextStep';

describe('NextStep', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NextStep />);
    expect(baseElement).toBeTruthy();
  });
});
