import { Story, Meta } from '@storybook/react';

import PillMeter, { IPillMeterProps } from './PillMeter';

export default {
  title: 'Components/PillMeter',
  component: PillMeter
} as Meta<typeof PillMeter>;

const Template: Story<IPillMeterProps> = (args) => {
  return <PillMeter {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Crypto Beats',
  total: 6,
  value: 4
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  total: 6,
  value: 4
};
