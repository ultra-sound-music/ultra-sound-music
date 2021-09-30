import React from 'react';
import Hero from './Hero';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GenerativeImage } from '@uiComponents';
import auroryImg from '@images/mock/aurory.png';

export default {
  title: 'Component/Hero',
  component: Hero
} as ComponentMeta<typeof Hero>;

export const Template: ComponentStory<typeof Hero> = (args) => {
  const styles = {
    width: '600px',
    height: '600px'
  };
  return (
    <div style={styles}>
      <Hero {...args} />
    </div>
  );
};

export const imageUrl = Template.bind({});
imageUrl.args = {
  src: auroryImg,
  size: 'medium'
};

export const ImageComponet = Template.bind({});
ImageComponet.args = {
  image: <img src={auroryImg} />,
  size: 'large'
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
