import { render } from '@testing-library/react';

import ConnectModal from './ConnectModal';

describe('ConnectModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConnectModal />);
    expect(baseElement).toBeTruthy();
  });
});
