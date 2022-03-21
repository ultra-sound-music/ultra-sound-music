import { render } from '@testing-library/react';

import Option from './OptionFieldSet';

describe('Option', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Option />);
    expect(baseElement).toBeTruthy();
  });
});
