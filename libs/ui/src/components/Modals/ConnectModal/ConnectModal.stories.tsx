import { Story, Meta } from '@storybook/react';
import ConnectModal, { IConnectModalProps } from './ConnectModal';

export default {
  component: ConnectModal,
  title: 'Modals/ConnectModal'
} as Meta;

const Template: Story<IConnectModalProps> = (args) => <ConnectModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true
};
