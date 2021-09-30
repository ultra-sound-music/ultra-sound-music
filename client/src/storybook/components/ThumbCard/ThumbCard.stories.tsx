import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import auroryImg from '@images/mock/aurory.png';

import ThumbCard from './ThumbCard';

export default {
  title: 'Component/ThumbCard',
  component: ThumbCard
} as ComponentMeta<typeof ThumbCard>;

const Template: ComponentStory<typeof ThumbCard> = (args) => {
  return (
    <BrowserRouter>
      <ThumbCard {...args} />
    </BrowserRouter>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  image: <img src={auroryImg} />,
  name: 'Po-licious',
  description: 'Barker'
};
