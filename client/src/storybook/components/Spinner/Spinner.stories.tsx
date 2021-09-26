import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Spinner from './Spinner';

export default {
  title: 'Component/Spinner ',
  component: Spinner
} as ComponentMeta<typeof Spinner>;

export const Template: ComponentStory<typeof Spinner> = (args) => {
  return <Spinner {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  cover: true
};
