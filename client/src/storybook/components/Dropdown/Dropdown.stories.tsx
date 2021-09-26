import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Dropdown from './Dropdown';

export default {
  title: 'Component/Dropdown ',
  component: Dropdown
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => {
  return <Dropdown {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  options: [
    { name: 'blockchain #1111' },
    { name: 'artist #22222' },
    { text: 'artist #33333' },
    { text: 'artist #4444' },
    { text: 'artist #5555' },
    { text: 'artist #66666' },
    { text: 'artist #7777' }
  ]
};
