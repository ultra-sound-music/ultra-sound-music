import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Overlay from './Overlay';

export default {
  title: 'Component/Overlay ',
  component: Overlay
} as ComponentMeta<typeof Overlay>;

const Template: ComponentStory<typeof Overlay> = (args) => {
  return (
    <div>
      <div>This content should be covered by the overlay</div>
      <div>This content should be covered by the overlay</div>
      <div>This content should be covered by the overlay</div>
      <div>This content should be covered by the overlay</div>
      <div>This content should be covered by the overlay</div>
      <div>This content should be covered by the overlay</div>
      <Overlay {...args} />
    </div>
  );
};

export const Basic = Template.bind({});
