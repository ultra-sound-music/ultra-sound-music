import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Toggle from './Toggle';

export default {
  title: 'Component/Toggle',
  component: Toggle
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => {
  return <Toggle {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  label: '',
  onToggle: () => {
    console.log('test');
  }
};
