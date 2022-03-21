import { Story, Meta } from '@storybook/react';
import { BidBox, IBidBoxProps } from './BidBox';

export default {
  component: BidBox,
  title: 'Components/BidBox'
} as Meta;

const Template: Story<IBidBoxProps> = (args) => <BidBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
