import { Story, Meta } from '@storybook/react';
import Notification, { INotificationProps } from './Notification';

export default {
  component: Notification,
  title: 'Components/Notification'
} as Meta;

const Template: Story<INotificationProps> = (args) => (
  <Notification {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  title: 'Important',
  message: 'Less important but good to know'
};
