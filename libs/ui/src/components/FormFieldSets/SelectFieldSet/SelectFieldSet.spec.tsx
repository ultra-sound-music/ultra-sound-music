import { render } from '@testing-library/react';

import SelectFieldSet from './SelectFieldSet';

describe('SelectFieldSet', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SelectFieldSet
        name='testSelect'
        offerValue={undefined}
        setOfferValue={() => null}
        currencyValue={undefined}
        setCurrencyValue={() => null}
        options={[]}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
