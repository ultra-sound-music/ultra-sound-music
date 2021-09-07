import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Pillbox from './Pillbox';

export default {
  title: 'Component/Pillbox ',
  component: Pillbox
} as ComponentMeta<typeof Pillbox>;

export const Template: ComponentStory<typeof Pillbox> = (args) => {
  const styles = { width: '300px', height: '400px' };
  const childStyles = { width: '100%', height: '60%' };

  return (
    <div style={styles}>
      <Pillbox {...args}>
        <div style={childStyles}>
          What if there was a way to let him see the innovation that&apos;s
          taking place today.
        </div>
      </Pillbox>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  header: 'El Yimmie Henrix',
  ctaText: 'Bring him back'
};
