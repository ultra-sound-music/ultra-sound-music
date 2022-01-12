import { Story, Meta } from '@storybook/react';
import { BidBox, BidBoxProps } from './BidBox';

export default {
  component: BidBox,
  title: 'Components/BidBox'
} as Meta;

const Template: Story<BidBoxProps> = (args) => <BidBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
