import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

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
  traits: [1, 2, 3, 4].map((n) => ({
    name: `Trait ${n}`,
    value: `${n}${n}${n}`
  }))
};
