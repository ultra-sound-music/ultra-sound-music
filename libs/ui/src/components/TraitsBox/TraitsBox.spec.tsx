import { render } from '@testing-library/react';

import TraitsBox from './TraitsBox';

describe('TraitsBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TraitsBox />);
    expect(baseElement).toBeTruthy();
  });
});
