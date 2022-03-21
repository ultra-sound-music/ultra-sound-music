import { render } from '@testing-library/react';

import TextAreaFieldSet from './TextAreaFieldSet';

describe('TextAreaFieldSet', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TextAreaFieldSet name='testTextAreaFieldSet' />);
    expect(baseElement).toBeTruthy();
  });
});
