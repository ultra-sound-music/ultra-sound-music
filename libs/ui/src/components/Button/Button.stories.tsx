import { Story, Meta } from '@storybook/react';
import Button, { IButtonProps } from './Button';

export default {
  component: Button,
  title: 'Button',
} as Meta;

const Template: Story<IButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
