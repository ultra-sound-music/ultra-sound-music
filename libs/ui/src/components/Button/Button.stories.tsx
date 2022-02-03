import { BrowserRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import Image from '../Image/Image';

import Button, { IButtonProps } from './Button';

import logo from '@usm/assets/img/logo.png';

export default {
  title: 'Components/Button',
  component: Button
} as Meta;

const Template: Story<IButtonProps> = (args) => {
  return (
    <BrowserRouter>
      <Button {...args} />
    </BrowserRouter>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  children: 'Primary'
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  children: 'Secondary'
};

export const WithImage = Template.bind({});
WithImage.args = {
  type: 'primary',
  image: <Image src={logo} />,
  children: 'With Image'
};

export const Disabled = Template.bind({});
Disabled.args = {
  type: 'primary',
  isDisabled: true,
  children: 'Disabled'
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  type: 'primary',
  image: <Image src={logo} />,
  isFullWidth: true,
  children: 'Full width with image'
};
