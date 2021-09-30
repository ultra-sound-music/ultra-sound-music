import React from 'react';
import Avatar, { IAvatarProps } from './Avatar';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GenerativeImage } from '@uiComponents';
// import auroryImg from '@images/mock/aurory.png';
import tlaloc from '@images/mock/tlaloc.png';
import auroryImg from '@images/mock/aurory.png';

export default {
  title: 'Component/Avatar',
  component: Avatar
} as ComponentMeta<typeof Avatar>;

export const Template: ComponentStory<typeof Avatar> = (args) => {
  return <Avatar {...args} />;
};

export const imageUrl = Template.bind({});
imageUrl.args = {
  src: auroryImg,
  size: 'medium'
};

export const imageComponet = Template.bind({});
imageComponet.args = {
  image: <img src={tlaloc} />,
  size: 'medium'
};

export const generative = Template.bind({});
generative.args = {
  image: (
    <GenerativeImage
      addresses={['0x70997970c51812dc3a010c7d01b50e0d17dc79c8']}
    />
  ),
  size: 'medium'
};
