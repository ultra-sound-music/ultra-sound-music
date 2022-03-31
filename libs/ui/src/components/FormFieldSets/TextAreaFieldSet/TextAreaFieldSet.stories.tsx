import { Story, Meta } from '@storybook/react';
import TextAreaFieldSet, { ITextAreaFieldSetProps } from './TextAreaFieldSet';

export default {
  component: TextAreaFieldSet,
  title: 'FormFieldSets/TextAreaFieldSet'
} as Meta;

const Template: Story<ITextAreaFieldSetProps> = (args) => <TextAreaFieldSet {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Please, indulge us with your life story...'
};
