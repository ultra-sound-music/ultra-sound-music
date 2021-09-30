import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Message from './Message';

export default {
  title: 'Component/Message ',
  component: Message
} as ComponentMeta<typeof Message>;

const Template: ComponentStory<typeof Message> = (args) => {
  return <Message {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  title: 'Important',
  message: 'Less important but good to know'
};
