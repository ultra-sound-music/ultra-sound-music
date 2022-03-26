import { Story, Meta } from '@storybook/react';

import InputFieldSet, { IInputFieldSetProps } from './InputFieldSet';

export default {
  component: InputFieldSet,
  title: 'FormElements/InputFieldSet'
} as Meta;

const Template: Story<IInputFieldSetProps> = (args) => <InputFieldSet {...args} />;

export const Text = Template.bind({});
Text.args = {
  label: 'Da Label'
};

export const Password = Template.bind({});
Password.args = {
  label: 'password',
  type: 'password'
};

export const Search = Template.bind({});
Search.args = {
  label: 'search',
  type: 'search'
};
