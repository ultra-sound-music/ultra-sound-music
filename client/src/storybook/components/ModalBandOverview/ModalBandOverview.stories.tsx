import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '@components';

import xolotlpng from '@images/mock/xolotl.png';

import ModalBandOverview from './ModalBandOverview';

export default {
  title: 'Component/Modal/ModalBandOverview ',
  component: ModalBandOverview
} as ComponentMeta<typeof ModalBandOverview>;

const Template: ComponentStory<typeof ModalBandOverview> = (args) => {
  return (
    <div>
      <ModalBandOverview {...args} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  subject: 'Mint a track',
  bandName: 'Cryptic Cryptos',
  currentStep: 2,
  totalSteps: 3,
  traits: [1, 2, 3, 4].map((n) => ({
    name: `Trait ${n}`,
    value: `${n}${n}${n}`
  })),
  bandMembers: Array(4).fill({
    name: 'Xolotl',
    imageSrc: xolotlpng
  }),
  ctaButton: <Button type='primary'>Boom</Button>,
  onHideModal: () => {
    console.log('TODO');
  }
};
