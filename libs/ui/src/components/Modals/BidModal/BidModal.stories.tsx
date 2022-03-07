import { Story, Meta } from '@storybook/react';

import solLogo from '@usm/assets/img/solana_logo_s.svg';

import Image from '../../Image/Image';
import BidModal, { IBidModalProps } from './BidModal';

export default {
  component: BidModal,
  title: 'Modals/BidModal'
} as Meta;

const Template: Story<IBidModalProps> = (args) => <BidModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  title: 'Bid successfully placed',
  body: 'Winning bid is announced xx.xx.xx. If your bid wins the auction, return to redeem your NFT.',
  fieldImage: solLogo,
  fieldValue: 'Jam Bot #1',
  fieldContext: 'SOL'
};
