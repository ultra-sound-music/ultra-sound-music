import { render } from '@testing-library/react';

import NewDrop from './NewDrop';

describe('NewDrop', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NewDrop />);
    expect(baseElement).toBeTruthy();
  });
});
