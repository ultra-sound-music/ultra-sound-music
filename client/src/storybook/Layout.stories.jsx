import React from 'react';
import Layout from './Layout';

export default {
  title: 'Grid/Layout',
  component: Layout
};

export const Template = (args) => <Layout {...args} />;

// export const LoggedIn = Template.bind({});
// LoggedIn.args = {
//   user: {}
// };

// export const LoggedOut = Template.bind({});
// LoggedOut.args = {};
