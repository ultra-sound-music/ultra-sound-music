import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import xolotl from '@images/mock/xolotl.png';
import { Selector, Button, PillSwitch, Avatar } from '@uiComponents';

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
  artistSelector: (
    <Selector
      title='Some select'
      select={
        <Button isSlim={true} image={<Avatar src={xolotl} size='tiny' />}>
          Mac Dre
        </Button>
      }
      options={[
        { value: 1, content: <div>This is option 1</div> },
        { value: 2, content: <div>This is option 2</div> },
        { value: 3, content: <div>This is option 3</div> }
      ]}
      onSelect={() => {
        console.log('Test');
      }}
    />
  ),
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
