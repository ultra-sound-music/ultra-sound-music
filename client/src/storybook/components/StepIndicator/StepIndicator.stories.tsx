import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import StepIndicator from './StepIndicator';

export default {
  title: 'Component/StepIndicator ',
  component: StepIndicator
} as ComponentMeta<typeof StepIndicator>;

const Template: ComponentStory<typeof StepIndicator> = (args) => {
  return (
    <div>
      {/* <button>open modal</button> */}
      <StepIndicator {...args} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  currentStep: 2,
  totalSteps: 3
};
