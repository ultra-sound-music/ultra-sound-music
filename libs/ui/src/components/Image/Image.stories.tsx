import { Story, Meta } from '@storybook/react';

import logo from '../../assets/logo.png';

import Image, { IImageProps } from './Image';

export default {
  component: Image,
  title: 'Components/Image',
} as Meta;

const Template: Story<IImageProps> = (args) => <Image {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  style: {
    height: '100px',
    width: 'auto'
  },
  src: logo
};
