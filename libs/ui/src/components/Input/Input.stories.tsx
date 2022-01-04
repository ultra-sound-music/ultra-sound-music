import { Story, Meta } from '@storybook/react';
import Input, { IInputProps } from './Input';

export default {
  component: Input,
  title: 'Forms/Input',
} as Meta;

const Template: Story<IInputProps> = (args) => <Input {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Da Label'
};
