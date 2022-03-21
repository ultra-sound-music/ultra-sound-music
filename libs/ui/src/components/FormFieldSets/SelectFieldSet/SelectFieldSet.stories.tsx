import { Story, Meta } from '@storybook/react';
import SelectFieldSet, { ISelectFieldSetProps } from './SelectFieldSet';

import genres from './SelectFieldSet.stories-data';

export default {
  component: SelectFieldSet,
  title: 'FormElements/Select'
} as Meta;

const Template: Story<ISelectFieldSetProps> = (args) => <SelectFieldSet {...args} />;

export const SingleSelect = Template.bind({});
SingleSelect.args = {
  label: 'Please, indulge us with your life story...',
  options: genres
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
  label: 'Please, indulge us with your life story...',
  isMulti: true,
  options: genres
};
