import { Story, Meta } from '@storybook/react';
import { Spinner, SpinnerProps } from './Spinner';

export default {
  component: Spinner,
  title: 'Spinner',
} as Meta;

const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
