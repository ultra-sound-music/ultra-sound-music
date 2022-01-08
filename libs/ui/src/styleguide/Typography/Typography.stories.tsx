import { Story, Meta } from '@storybook/react';
import Typography from './Typography';

const names = [
  'brand',
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
  title: 'Styleguide/Typography',
} as Meta;

const Template: Story = () => <Typography names={names} />;

export const Primary = Template.bind({});
Primary.args = {};
