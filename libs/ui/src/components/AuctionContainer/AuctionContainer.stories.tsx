import { Story, Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { AuctionContainer, AuctionContainerProps } from './AuctionContainer';

export default {
  component: AuctionContainer,
  title: 'Components/AuctionContainer'
} as Meta;

const Template: Story<AuctionContainerProps> = (args) => (
  <RecoilRoot>
    <AuctionContainer {...args} />
  </RecoilRoot>
);

export const Primary = Template.bind({});
Primary.args = {};
