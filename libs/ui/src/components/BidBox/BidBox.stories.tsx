import { Story, Meta } from '@storybook/react';
import { BidBox, BidBoxProps } from './BidBoxContainer/BidBoxContainer';

export default {
  component: BidBox,
  title: 'Components/BidBox'
} as Meta;

const Template: Story<BidBoxProps> = (args) => <BidBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  endedAt: 1647633156892,
  currentHighBidSol: 173.5,
  currentWallet: '0x1ds12785',
  walletBalanceSol: 513.21,
  bids: [
    {
      bid: 173.5,
      bidder: '0x123',
      timestamp: 1647633256892
    },
    {
      bid: 101.0,
      bidder: '0xvasd12asd3',
      timestamp: 1647633156892
    }
  ],
  isLive: true,
  winningWallet: '0x1ds12345',
  onClickBidNow: () => console.log('onClickBidNow()')
};
