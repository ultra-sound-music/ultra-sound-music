import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EntityRow from './EntityRow';

import mixcoatl from '../../assets/img/mixcoatl.png';

export default {
  title: 'Component/EntityRow ',
  component: EntityRow
} as ComponentMeta<typeof EntityRow>;

const Template: ComponentStory<typeof EntityRow> = (args) => {
  const style = {
    width: '422px'
  };

  return (
    <div style={style}>
      <EntityRow {...args} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  imageSrc: mixcoatl,
  line1: 'Bored Mixcoatl Ape',
  line2: 'hunter',
  onClick: () => {
    console.log('test');
  }
};
