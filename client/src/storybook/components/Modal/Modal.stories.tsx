import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Modal from './Modal';

export default {
  title: 'Modal/Base ',
  component: Modal,
  argTypes: { hideModal: { action: 'hideModal' } }
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
  return (
    <div>
      {/* <button>open modal</button> */}
      <Modal {...args}>
        And so, today my world it smiles Your hand in mine, we walk the miles
        Thanks to you, it will be done For you to me are the only one Alright,
        there
      </Modal>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  isOpen: true,
  subject: 'Band overview',
  title: 'Led Zepellin was a band before its time'
};
