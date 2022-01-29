import { Story, Meta } from '@storybook/react';

import Accordian, { IAccordianProps } from './Accordian';

export default {
  title: 'Components/Accordian ',
  component: Accordian
} as Meta;

const Template: Story<IAccordianProps> = (args) => {
  return <Accordian {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  term: 'When do you lunch?',
  details: 'We love lunching.  We try to lunch every day.'
};
