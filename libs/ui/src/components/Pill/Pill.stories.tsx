import { Story, Meta } from '@storybook/react';

import Pill, { IPillProps } from './Pill';

export default {
  title: 'Components/Pill',
  component: Pill
} as Meta<typeof Pill>;

const Template: Story<IPillProps> = (args) => {
  return <Pill {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Crypto Beats',
  children: 'ultra sounds'
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  children: 'ultra sounds'
};
