import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import InfoText from './InfoText';

export default {
  title: 'Component/InfoText ',
  component: InfoText
} as ComponentMeta<typeof InfoText>;

const Template: ComponentStory<typeof InfoText> = (args) => {
  return <InfoText {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  children: 'Led Zepellin was a band before its time'
};
