import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import mixcoatl from '@images/mock/mixcoatl.png';

import ModalStartBand from './ModalStartBand';

export default {
  title: 'Modal/ModalStartBand ',
  component: ModalStartBand
} as ComponentMeta<typeof ModalStartBand>;

const Template: ComponentStory<typeof ModalStartBand> = (args) => {
  return (
    <div>
      <ModalStartBand {...args} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  bandName: 'The Sacrifices',
  activeArtistName: 'Mixcoatl',
  activeArtistImageSrc: mixcoatl,
  step: 'confirm',
  isOpen: true,
  onHide: () => {
    console.log('TODO');
  },
  onStartBand: () => {
    console.log('TODO');
  }
};
