import { Story, Meta } from '@storybook/react';

import Modal, { IModalProps } from './Modal';

export default {
  title: 'Modals/Base ',
  component: Modal,
  argTypes: { hideModal: { action: 'hideModal' } }
} as Meta<typeof Modal>;

const Template: Story<IModalProps> = (args) => {
  return (
    <div>
      <Modal {...args}>
        And so, today my world it smiles. Your hand in mine, we walk the miles.
        Thanks to you, it will be done. For you to me are the only one.
      </Modal>
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  subject: 'Band overview',
  title: 'Led Zepellin was a band before its time'
};
