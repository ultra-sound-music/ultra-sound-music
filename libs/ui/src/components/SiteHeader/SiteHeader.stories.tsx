import { BrowserRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import Nav from '../Nav/Nav';

import SiteHeader, { ISiteHeaderProps } from './SiteHeader';

export default {
  title: 'Components/SiteHeader',
  component: SiteHeader
} as Meta;

const Template: Story<ISiteHeaderProps> = (args) => {
  return (
    <BrowserRouter>
      <SiteHeader {...args} />
    </BrowserRouter>
  );
};

const navItems = [
  {
    content: 'Item 1',
    to: 'some/path'
  },
  {
    content: 'Item 2',
    to: 'some/path'
  },
  {
    content: 'Item 3',
    to: 'some/path'
  }  
];  

export const Primary = Template.bind({});
Primary.args = {
  nav: <Nav items={navItems} />
};
