import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { getMockTraits } from '../../utils';

import TraitsBlock from './TraitsBlock';

export default {
  title: 'Component/TraitsBlock',
  component: TraitsBlock
} as ComponentMeta<typeof TraitsBlock>;

const Template: ComponentStory<typeof TraitsBlock> = (args) => {
  return <TraitsBlock {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  traits: getMockTraits()
};

export const Blank = Template.bind({});
