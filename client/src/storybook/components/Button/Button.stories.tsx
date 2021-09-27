import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import mixcoatl from '@images/mock/mixcoatl.png';

import { Avatar } from '@uiComponents';

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

export const Alt1 = Template.bind({});
Alt1.args = {
  type: 'secondary',
  image: <Avatar src={mixcoatl} size='tiny' />,
  children: 'Button'
};
