import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BandCard from './BandCard';

import auroryImg from '@images/mock/aurory.png';

export default {
  title: 'Component/BandCard',
  component: BandCard
} as ComponentMeta<typeof BandCard>;

const Template: ComponentStory<typeof BandCard> = (args) => {
  const styles = { width: '290px', height: '400px' };

  return (
    <div style={styles}>
      <BrowserRouter>
        <BandCard {...args} />
      </BrowserRouter>
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  name: 'The Solanas',
  members: [auroryImg, auroryImg, auroryImg, auroryImg, auroryImg],
  traits: [1, 2, 3, 4].map((n) => ({
    name: `Trait ${n}`,
    value: `${n}${n}${n}`
  }))
};
