import { Story, Meta } from '@storybook/react';
import { BidBox, BidBoxProps } from './BidBox';

export default {
  component: BidBox,
  title: 'Components/BidBox'
} as Meta;

const Template: Story<BidBoxProps> = (args) => <BidBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  timeUntilAuctionEnd: { days: 0, hours: 21, minutes: 46, seconds: 11 },
  currentHighBidSol: 173.5,
  isWalletConnected: true,
  walletBalanceSol: 513.21,
  recentBids: [
    {
      amountSol: 173.5,
      userWalletAddress: '0x123',
      timeSinceBid: { seconds: 19 }
    },
    {
      amountSol: 101.0,
      userWalletAddress: '0xvasd12asd3',
      timeSinceBid: { minutes: 45 }
    }
  ],
  isAuctionFinished: false,
  traits: { name: 'Jam Bot #1' },
  winningWalletAddress: '0x1ds...sdfsa'
};
