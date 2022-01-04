import { Story, Meta } from '@storybook/react';

import xolotl from '../../assets/xolotl.png';

import Avatar from '../Avatar/Avatar';
import Figure, { IFigureProps } from './Figure';

export default {
  title: 'Components/Figure',
  component: Figure
} as Meta<typeof Figure>;

const Template: Story<IFigureProps> = (args) => {
  return <Figure {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  image: <Avatar src={xolotl} />,
  title: 'Led Zep',
  children: 'Led Zepellin was a band before its time'
};
