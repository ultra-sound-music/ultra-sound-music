import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button, Avatar } from '@components';

import xolotl from '@images/mock/xolotl.png';

import ArtistCard from './ArtistCard';

export default {
  title: 'Component/ArtistCard ',
  component: ArtistCard
} as ComponentMeta<typeof ArtistCard>;

const Template: ComponentStory<typeof ArtistCard> = (args) => {
  const styles = { width: '330px', height: '500px' };
  return (
    <div style={styles}>
      <BrowserRouter>
        <ArtistCard {...args} />
      </BrowserRouter>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  name: 'Fraggle Rock',
  traits: [1, 2, 3, 4].map((n) => ({
    name: `Trait ${n}`,
    value: `${n}${n}${n}`
  })),
  isShowingActiveArtist: false,
  doShowExternalLink: false,
  cta: <Button>Do stuff</Button>
};

export const Alt1 = Template.bind({});
Alt1.args = {
  name: 'Fraggle Rock',
  traits: [1, 2, 3, 4].map((n) => ({
    name: `Trait ${n}`,
    value: `${n}${n}${n}`
  })),
  isShowingActiveArtist: true,
  doShowExternalLink: true,
  cta: <Button>Do stuff</Button>
};

export const Alt2 = Template.bind({});
Alt2.args = {
  avatar: <Avatar src={xolotl} />,
  name: 'Fraggle Rock',
  traits: [1, 2, 3, 4].map((n) => ({
    name: `Trait ${n}`,
    value: `${n}${n}${n}`
  })),
  isShowingActiveArtist: true,
  doShowExternalLink: true,
  cta: <Button>Do stuff</Button>
};
