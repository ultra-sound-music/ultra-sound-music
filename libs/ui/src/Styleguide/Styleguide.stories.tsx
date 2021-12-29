import { Story, Meta } from '@storybook/react';
import Styleguide from './Styleguide';

export default {
  component: Styleguide,
  title: 'Styleguide',
} as Meta;

const Template: Story = () => <Styleguide />;

export const Primary = Template.bind({});
Primary.args = {};
