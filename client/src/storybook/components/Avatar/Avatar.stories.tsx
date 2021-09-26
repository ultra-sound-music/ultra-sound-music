import React from 'react';
import Avatar, { IAvatarProps } from './Avatar';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import auroryImg from '../../assets/img/aurory.png';

export default {
  title: 'Component/Avatar',
  component: Avatar
} as ComponentMeta<typeof Avatar>;

export const Template: ComponentStory<typeof Avatar> = (args) => {
  const defaultProps: IAvatarProps = {
    src: auroryImg,
    size: 'medium'
  };

  const props = Object.assign({}, defaultProps, args);
  return <Avatar {...props} />;
};

export const imageUrl = Template.bind({});
imageUrl.args = {
  src: auroryImg,
  size: 'medium'
};

export const ImageComponet = Template.bind({});
ImageComponet.args = {
  image: <img src={auroryImg} />,
  size: 'medium'
};
