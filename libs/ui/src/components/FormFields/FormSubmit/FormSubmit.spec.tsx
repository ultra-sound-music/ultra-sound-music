import { render } from '@testing-library/react';

import FormSubmit from './FormSubmit';

describe('FormSubmit', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormSubmit />);
    expect(baseElement).toBeTruthy();
  });
});
