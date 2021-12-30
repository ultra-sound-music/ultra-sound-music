import { Story, Meta } from '@storybook/react';
import Typography from './Typography';

const names = [
  'h1',
  'h2',
  'h3',
  'h4',
  'subhead',
  'body',
  'small'
];

export default {
  component: Typography,
  title: 'Typography',
} as Meta;

const Template: Story = () => <Typography names={names} />;

export const Primary = Template.bind({});
Primary.args = {};
