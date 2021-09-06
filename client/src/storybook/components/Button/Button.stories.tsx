import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button, { EButtonStyle, EButtonSize } from './Button';

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
  isPrimary: true,
  text: 'Button'
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'Button'
};

export const Large = Template.bind({});
Large.args = {
  size: EButtonSize.LARGE,
  text: 'Button'
};

export const Small = Template.bind({});
Small.args = {
  size: EButtonSize.SMALL,
  text: 'Button'
};

export const Light = Template.bind({});
Light.args = {
  style: EButtonStyle.LIGHT,
  text: 'Button'
};

export const Dark = Template.bind({});
Dark.args = {
  style: EButtonStyle.DARK,
  text: 'Button'
};
