import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import PillSwitch from './PillSwitch';

export default {
  title: 'Component/PillSwitch ',
  component: PillSwitch
} as ComponentMeta<typeof PillSwitch>;

export const Template: ComponentStory<typeof PillSwitch> = (args) => {
  return <PillSwitch {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  isOn: true,
  onClick: () => {
    console.log('test');
  }
};
