import { Story, Meta } from '@storybook/react';
import ReactTooltip from 'react-tooltip';

import AnimatedMeter, { IAnimatedMeterProps } from './AnimatedMeter';

export default {
  title: 'Components/AnimatedMeter',
  component: AnimatedMeter
} as Meta<typeof AnimatedMeter>;

const Template: Story<IAnimatedMeterProps> = (args) => {
  return (
    <div>
      <AnimatedMeter {...args} />
      <ReactTooltip />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Crypto Beats',
  name: 'test label',
  value: [5, 13]
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  name: 'test label',
  value: [13, 7]
};
