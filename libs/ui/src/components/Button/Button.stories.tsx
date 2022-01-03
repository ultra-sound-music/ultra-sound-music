import { BrowserRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import Image from '../Image/Image';

import Button, { IButtonProps } from './Button';

import logo from '../../assets/logo.png';

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

export const PrimaryTemplate = Template.bind({});
PrimaryTemplate.args = {
  type: 'primary',
  children: 'Primary'
};

export const SecondaryTemplate = Template.bind({});
SecondaryTemplate.args = {
  type: 'secondary',
  children: 'Secondary'
};

export const ImageTemplate = Template.bind({});
ImageTemplate.args = {
  type: 'primary',
  image: <Image src={logo} />,
  children: 'With Image'
};

export const FullWidthTemplate = Template.bind({});
FullWidthTemplate.args = {
  type: 'primary',
  image: <Image src={logo} />,
  isFullWidth: true,
  children: 'Full width with image'
};