import { Story, Meta } from '@storybook/react';

import AnimatedMeter, { IAnimatedMeterProps } from './AnimatedMeter';

export default {
  title: 'Components/AnimatedMeter',
  component: AnimatedMeter
} as Meta<typeof AnimatedMeter>;

const Template: Story<IAnimatedMeterProps> = (args) => {
  return <AnimatedMeter {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Crypto Beats',
  value: [5, 13]
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  value: [13, 7]
};
