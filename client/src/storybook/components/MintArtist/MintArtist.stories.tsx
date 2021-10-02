import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button, TraitsBlock } from '@uiComponents';
import { getMockTraits } from '../../utils/index';

import MintArtist from './MintArtist';

export default {
  title: 'Component/MintArtist ',
  component: MintArtist
} as ComponentMeta<typeof MintArtist>;

const Template: ComponentStory<typeof MintArtist> = (args) => {
  const styles = { width: '330px', height: '500px' };
  return (
    <div style={styles}>
      <MintArtist {...args} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  name: 'El Yimmie Henreex',
  price: '2.5',
  traits: <TraitsBlock traits={getMockTraits()} />,
  ctaButton: (
    <Button type='primary' isFullWidth={true}>
      Mint artist
    </Button>
  )
};
