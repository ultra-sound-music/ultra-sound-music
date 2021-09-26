import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import FigureCard from './FigureCard';

export default {
  title: 'Component/FigureCard ',
  component: FigureCard
} as ComponentMeta<typeof FigureCard>;

const Template: ComponentStory<typeof FigureCard> = (args) => {
  return <FigureCard {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  image: '',
  children: 'Led Zepellin was a band before its time'
};
