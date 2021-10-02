import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Carousel from './Carousel';

export default {
  title: 'Component/Carousel',
  component: Carousel
} as ComponentMeta<typeof Carousel>;

const Template: ComponentStory<typeof Carousel> = (args) => {
  return <Carousel {...args} />;
};

export const Basic = Template.bind({});
const children = (
  <>
    <div>Testing 1</div>
    <div>Testing 2</div>
    <div>Testing 3</div>
  </>
);

Basic.args = {
  children: children.props.children
};

export const Blank = Template.bind({});
