import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Accordian from './Accordian';

export default {
  title: 'Component/Accordian ',
  component: Accordian
} as ComponentMeta<typeof Accordian>;

const Template: ComponentStory<typeof Accordian> = (args) => {
  return <Accordian {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  term: 'When do you lunch?',
  details: 'We love lunching.  We try to lunch every day.'
};
