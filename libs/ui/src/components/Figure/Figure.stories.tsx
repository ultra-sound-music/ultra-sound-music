import { BrowserRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import xolotl from '../../assets/xolotl.png';

import Avatar from '../Avatar/Avatar';
import Link from '../Link/Link';
import Figure, { IFigureProps } from './Figure';

export default {
  title: 'Components/Figure',
  component: Figure
} as Meta<typeof Figure>;

const Template: Story<IFigureProps> = (args) => {
  return <BrowserRouter><Figure {...args} /></BrowserRouter>;
};

export const Primary = Template.bind({});
Primary.args = {
  image: <Avatar src={xolotl} />,
  title: 'Led Zep',
  caption: 'Led Zepellin was a band before its time'
};

export const WithLink = Template.bind({});
WithLink.args = {
  image: <Avatar src={xolotl} />,
  title: <Link to={'test'}>Led Zep</Link>,
  caption: 'Led Zepellin was a band before its time'
};