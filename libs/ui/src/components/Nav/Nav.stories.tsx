import { BrowserRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import logo from '@usm/images/logo.png';
import Image from '../Image/Image';

import Nav, { INavProps } from './Nav';

export default {
  title: 'Components/Nav',
  component: Nav,
} as Meta;

const Template: Story<INavProps> = (args) => {
  return (
    <BrowserRouter>
      <Nav {...args} />
    </BrowserRouter>      
  )
};

const items = [
  {
    content: <Image src={logo} style={{width: '30px', height: '30px'}} />,
    to: 'some/path'
  },
  {
    content: 'Deafbeef',
    to: 'some/path'
  },
  {
    content: 'Euler Beats',
    to: 'some/path'
  },
  {
    content: 'POW NFT',
    to: 'some/path'
  }  
];

export const Primary = Template.bind({});
Primary.args = {
  items
};
