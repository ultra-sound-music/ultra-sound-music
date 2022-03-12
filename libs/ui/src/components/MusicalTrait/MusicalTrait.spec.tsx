import { render } from '@testing-library/react';

import MusicalTrait, { IMusicalTraitProps } from './MusicalTrait';

describe('MusicalTrait', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MusicalTrait />);
    expect(baseElement).toBeTruthy();
  });
});
