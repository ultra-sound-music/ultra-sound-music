import { Story, Meta } from '@storybook/react';
import { Link, LinkProps } from './Link';

export default {
  component: Link,
  title: 'Components/Link',
} as Meta;

const Template: Story<LinkProps> = (args) => <Link {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
