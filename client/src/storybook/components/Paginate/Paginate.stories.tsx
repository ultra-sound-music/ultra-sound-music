import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Paginate from './Paginate';

export default {
  title: 'Component/Paginate',
  component: Paginate
} as ComponentMeta<typeof Paginate>;

const Template: ComponentStory<typeof Paginate> = (args) => {
  return <Paginate {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  onClickPrev: () => {
    console.log('TEST');
  },
  onClickNext: () => {
    console.log('TEST');
  }
};

export const Blank = Template.bind({});
