import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import SiteFooter from './SiteFooter';

export default {
  title: 'Component/SiteFooter',
  component: SiteFooter
} as ComponentMeta<typeof SiteFooter>;

const Template: ComponentStory<typeof SiteFooter> = (args) => {
  return (
    <BrowserRouter>
      <SiteFooter {...args} />
    </BrowserRouter>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
