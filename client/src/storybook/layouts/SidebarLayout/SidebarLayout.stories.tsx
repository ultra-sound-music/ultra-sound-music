import React from 'react';
import SidebarLayout, { ISidebarLayoutProps } from './SidebarLayout';

export default {
  title: 'Grid/Sidebar',
  component: SidebarLayout
};

export const Template = (args: ISidebarLayoutProps): JSX.Element => {
  return <SidebarLayout {...args} />;
};

export const Alt1 = Template.bind({});
Alt1.args = {
  sidebar: <div>@SIDEBAR@</div>,
  main: <div>@MAIN@</div>
};
