import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '@uiComponents';

import xolotl from '@images/mock/xolotl.png';
import mixcoatl from '@images/mock/mixcoatl.png';
import tlaloc from '@images/mock/tlaloc.png';

import ModalBandDetails from './ModalBandDetails';

export default {
  title: 'Modal/ModalBandDetails ',
  component: ModalBandDetails
} as ComponentMeta<typeof ModalBandDetails>;

const Template: ComponentStory<typeof ModalBandDetails> = (args) => {
  return (
    <div>
      {/* <button>open modal</button> */}
      <ModalBandDetails {...args} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  subject: 'Mint a track',
  message:
    'Spiderman, spiderman, does whatever a spider can, spins a web any size, catches thieves just like flies.',
  artistName: 'Xolotl',
  artistImageSrc: xolotl,
  bandName: 'Spidey & Friends',
  bandMembers: Array(4).fill(mixcoatl),
  trackName: 'Track',
  trackImageSrc: tlaloc,
  currentStep: 2,
  totalSteps: 3,
  isOpen: true,
  ctaButton: <Button type='primary'>Boom</Button>,
  onHide: () => {
    console.log('TODO');
  }
};
