import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Pill from './Pill';

export default {
  title: 'Component/Pill',
  component: Pill
} as ComponentMeta<typeof Pill>;

const Template: ComponentStory<typeof Pill> = (args) => {
  return <Pill {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  children: 'Take this Pill'
};
