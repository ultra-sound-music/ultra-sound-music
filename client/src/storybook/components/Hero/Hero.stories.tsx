import React from 'react';
import Hero, { IHeroProps } from './Hero';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import auroryImg from '../../assets/img/aurory.png';

export default {
  title: 'Component/Hero',
  component: Hero
} as ComponentMeta<typeof Hero>;

export const Template: ComponentStory<typeof Hero> = (args) => {
  const defaultProps: IHeroProps = {
    src: auroryImg,
    size: 'medium'
  };

  const props = Object.assign({}, defaultProps, args);
  const styles = {
    width: '600px',
    height: '600px'
  };
  return (
    <div style={styles}>
      <Hero {...props} />
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
