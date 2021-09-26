import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../../components';
import TextBlock from './TextBlock';

export default {
  title: 'Component/TextBlock',
  component: TextBlock
} as ComponentMeta<typeof TextBlock>;

const Template: ComponentStory<typeof TextBlock> = (args) => {
  const styles = {
    width: '620px'
  };

  return (
    <div style={styles}>
      <TextBlock {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  subject: 'Crypto Beats',
  title: 'ultra sound music ',
  subTitle:
    'Once minted you can use your artist to join a band or create your own band. Up to 6 artists can participate in a band.',
  children:
    'Once minted you can use your artist to join a band or create your own band. Up to 6 artists can participate in a band.',
  dataPoint: '999/9999',
  callout: 'minting is open',
  ctaButton: <Button>mint an artist</Button>
};

export const MintYourArtist = Template.bind({});
MintYourArtist.args = {
  subject: 'Limited to 10,000 NFTs on Solana',
  title: 'ultra sound music ',
  children:
    '9,999 holy cows grazing the heavenly green pastures of the metaverse have entered the pearly white gates of the Ethereum blockchain. The Holy Cows community accepts all shapes, sizes and cultures. Join on a quest filled with cow tipping rewards!',
  dataPoint: '999/9999',
  ctaButton: <Button>mint an artist</Button>
};

export const OnBoardingSteps = Template.bind({});
OnBoardingSteps.args = {
  subject: 'HOW IT WORKS',
  title: 'Mint a musician',
  subTitle:
    'Once minted you can use your artist to join a band or create your own band. Up to 6 artists can participate in a band.'
};

export const Roadmap = Template.bind({});
Roadmap.args = {
  subject: '01 Launch on solana',
  legend:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'
};
