import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ScrollBlock from './ScrollBlock';

export default {
  title: 'Component/ScrollBlock ',
  component: ScrollBlock
} as ComponentMeta<typeof ScrollBlock>;

export const Template: ComponentStory<typeof ScrollBlock> = (args) => {
  return <ScrollBlock {...args} />;
};

export const Basic = Template.bind({});
const content = (
  <>
    <div>
      <div>This is section 1: Block 1</div>
      <div>This is section 1: Block 2</div>
    </div>
    <div>
      <div>This is section 2: Block 1</div>
      <div>This is section 2: Block 2</div>
    </div>
    <div>
      <div>This is section 3: Block 1</div>
      <div>This is section 3: Block 2</div>
    </div>
  </>
);

Basic.args = {
  children: content.props.children
};
