import { BrowserRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import logo from '@usm/assets/img/logo.png';
import phantomLogo from '@usm/assets/img/phantom_purple.svg';

import xolopng from '../../assets/xolotl.png';
import Image from '../Image/Image';
import Button, { IButtonProps } from './Button';

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
  image: <Image src={xolopng} />,
  children: 'With Image'
};

export const Tile = Template.bind({});
Tile.args = {
  type: 'primary',
  isSmall: true,
  shape: 'tile',
  image: <Image src={phantomLogo} />,
  subtext: 'Connect with a browser extension',
  children: 'Phantom'
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

export const Small = Template.bind({});
Small.args = {
  type: 'primary',
  isSmall: true,
  children: 'Small'
};
