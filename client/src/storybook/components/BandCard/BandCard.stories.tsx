import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Avatar from '../Avatar/Avatar';
import Trait, { ETraitStyle } from '../Trait/Trait';
import BandCard from './BandCard';

import auroryImg from '../../assets/img/aurory.png';

export default {
  title: 'Component/BandCard',
  component: BandCard
} as ComponentMeta<typeof BandCard>;

const Template: ComponentStory<typeof BandCard> = (args) => {
  const styles = { width: '281px', height: '400px' };

  return (
    <div style={styles}>
      <BrowserRouter>
        <BandCard {...args} />
      </BrowserRouter>
    </div>
  );
};

function genAvatar(key: number): JSX.Element {
  return <Avatar key={key} imageUrl={auroryImg} />;
}

function genTraits(key: number): JSX.Element {
  return <Trait key={key} name='Hyphy' style={ETraitStyle.LIGHT} />;
}

const members = [
  genAvatar(1),
  genAvatar(2),
  genAvatar(3),
  genAvatar(1),
  genAvatar(2),
  genAvatar(3)
];
const traits = [
  genTraits(1),
  genTraits(2),
  genTraits(3),
  genTraits(1),
  genTraits(2),
  genTraits(3)
];

export const Primary = Template.bind({});
Primary.args = {
  name: 'The Solanas',
  members,
  traits
};
