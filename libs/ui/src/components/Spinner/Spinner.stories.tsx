import { Story, Meta } from '@storybook/react';
import Spinner, { ISpinnerProps } from './Spinner';

export default {
  component: Spinner,
  title: 'Components/Spinner',
} as Meta;

const Template: Story<ISpinnerProps> = (args) => <Spinner {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
