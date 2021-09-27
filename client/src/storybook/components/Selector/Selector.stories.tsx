import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import xolotl from '@images/mock/xolotl.png';
import { EntityRow, Avatar, Button } from '@uiComponents';

import Selector from './Selector';

export default {
  title: 'Component/Selector ',
  component: Selector
} as ComponentMeta<typeof Selector>;

const Template: ComponentStory<typeof Selector> = (args) => {
  return (
    <div>
      <Selector {...args} />
    </div>
  );
};

export const Basic = Template.bind({});

Basic.args = {
  title: 'Choose your own adventure',
  // select: <EntityRow imageSrc={xolotl} line1='The Sacrifice' size='tiny' />,
  select: (
    <Button image={<Avatar src={xolotl} size='tiny' />}>The Sacrifice</Button>
  ),
  options: [
    { value: 1, content: <div>This is option 1</div> },
    { value: 2, content: <div>This is option 2</div> },
    { value: 3, content: <div>This is option 3</div> }
  ]
};
