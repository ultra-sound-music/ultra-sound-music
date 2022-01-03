import { Story, Meta } from '@storybook/react';
import Image, { IImageProps } from './Image';

export default {
  component: Image,
  title: 'Components/Image',
} as Meta;

const Template: Story<IImageProps> = (args) => <Image {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
