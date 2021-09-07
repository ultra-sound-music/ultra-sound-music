import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Trait from './Trait';

export default {
  title: 'Component/Trait ',
  component: Trait
} as ComponentMeta<typeof Trait>;

const Template: ComponentStory<typeof Trait> = (args) => {
  return <Trait {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  name: 'Fonky'
};
