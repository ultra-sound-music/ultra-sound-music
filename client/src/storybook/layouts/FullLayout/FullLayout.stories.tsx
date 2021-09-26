import React from 'react';
import FullLayout, { IFullLayoutProps } from './FullLayout';

export default {
  title: 'Grid/FullLayout',
  component: FullLayout
};

export const Template = (args: IFullLayoutProps): JSX.Element => (
  <FullLayout {...args} />
);

// export const LoggedIn = Template.bind({});
// LoggedIn.args = {
//   user: {}
// };

// export const LoggedOut = Template.bind({});
// LoggedOut.args = {};
