import { Story, Meta } from '@storybook/react';

import SearchFieldSet, { ISearchFieldSetProps } from './SearchFieldSet';

export default {
  component: SearchFieldSet,
  title: 'FormFieldSets/SearchFieldSet'
} as Meta;

const Template: Story<ISearchFieldSetProps> = (args) => <SearchFieldSet {...args} />;

export const Root = Template.bind({});
Root.args = {
  label: 'search'
};

export const Amount = Template.bind({});
Amount.args = {
  label: 'amount'
};
