import { render } from '@testing-library/react';

import DisconnectModal from './DisconnectModal';

describe('DisconnectModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DisconnectModal />);
    expect(baseElement).toBeTruthy();
  });
});
