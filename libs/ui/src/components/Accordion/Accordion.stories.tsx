import { Story, Meta } from '@storybook/react';

import Accordion, { IAccordionProps } from './Accordion';

export default {
  title: 'Components/Accordion ',
  component: Accordion
} as Meta;

const Template: Story<IAccordionProps> = (args) => {
  return <Accordion {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  term: 'When do you lunch?',
  details: 'We love lunching.  We try to lunch every day.'
};
