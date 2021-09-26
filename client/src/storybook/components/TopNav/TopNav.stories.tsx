import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import TopNav from './TopNav';

export default {
  title: 'Component/TopNav',
  component: TopNav
} as ComponentMeta<typeof TopNav>;

const Template: ComponentStory<typeof TopNav> = (args) => {
  return (
    <BrowserRouter>
      <TopNav {...args} />
    </BrowserRouter>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      itemName: 'ITEM 1',
      text: 'Deafbeef',
      to: 'Funkytown',
      isActive: true
    },
    {
      itemName: 'ITEM 2',
      text: 'Euler Beats',
      to: 'Funkytown'
    },
    {
      itemName: 'ITEM 3',
      text: 'POW NFT',
      to: 'Funkytown'
    },
    {
      itemName: 'ITEM 4',
      text: 'Synapses',
      to: 'Funkytown'
    }
  ]
};
