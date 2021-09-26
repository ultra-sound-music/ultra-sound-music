import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from './Button';

export default {
  title: 'Component/Button',
  component: Button
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => {
  return (
    <BrowserRouter>
      <Button {...args} />
    </BrowserRouter>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  children: 'Button'
};
