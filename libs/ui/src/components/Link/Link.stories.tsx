import { Story, Meta } from '@storybook/react';
import Link, { ILinkProps } from './Link';

export default {
  component: Link,
  title: 'Components/Link',
} as Meta;

const Template: Story<ILinkProps> = (args) => <Link {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  to: 'https://test.url',
  children: 'Demo'
};
