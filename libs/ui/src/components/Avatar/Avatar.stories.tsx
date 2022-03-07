import { Story, Meta } from '@storybook/react';

import Image from '../Image/Image';
import Avatar, { IAvatarProps } from './Avatar';

import xolotl from '../../assets/xolotl.png';

export default {
  title: 'Components/Avatar',
  component: Avatar
} as Meta<typeof Avatar>;

const Template: Story<IAvatarProps> = (args) => <Avatar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  image: <Image src={xolotl} />,
  shape: 'circle',
  size: 'medium'
};
