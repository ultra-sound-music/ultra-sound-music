import React from 'react';

import GenerativeImage from './GenerativeImage';

export default {
  title: 'Component/GenerativeImage ',
  component: GenerativeImage
};

const Template = (args) => {
  return <GenerativeImage {...args} />;
};

export const OneAddress = Template.bind({});
OneAddress.args = {
  addresses: ['0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097']
};

export const TwoAddresses = Template.bind({});
TwoAddresses.args = {
  addresses: [
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    '0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097',
    '0xcd3b766ccdd6ae721141f452c550ca635964ce71'
  ]
};
