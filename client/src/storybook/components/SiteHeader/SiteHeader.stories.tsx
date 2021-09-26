import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PillSwitch } from '../../components';

import SiteHeader from './SiteHeader';

export default {
  title: 'Component/SiteHeader',
  component: SiteHeader
} as ComponentMeta<typeof SiteHeader>;

const Template: ComponentStory<typeof SiteHeader> = (args) => {
  return (
    <BrowserRouter>
      <SiteHeader {...args} />
    </BrowserRouter>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  connectButton: (
    <PillSwitch
      status='off'
      onClick={() => {
        console.log(1);
      }}
    >
      Connect
    </PillSwitch>
  )
};
