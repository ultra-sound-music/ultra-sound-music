import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import InlineList from './InlineList';

export default {
  title: 'Component/InlineList ',
  component: InlineList
} as ComponentMeta<typeof InlineList>;

const Template: ComponentStory<typeof InlineList> = (args) => {
  return <InlineList {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  items: ['Fonky', 'Bombastik', 'Ultra Sound', 'Hyphy', 'Degenerative']
};
