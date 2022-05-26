import { Story, Meta } from '@storybook/react';

import NextStep, { NextStepProps } from './NextStep';

export default {
  title: 'Components/NextStep',
  component: NextStep
} as Meta;

const Template: Story<NextStepProps> = (args) => {
  return <NextStep {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  number: 4,
  status: 'open',
  children: 'El aragan y su destino'
};
