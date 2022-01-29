import { Story, Meta } from '@storybook/react';

import { Button } from '../Button/Button';

import Selector, { ISelectorProps } from './Selector';

export default {
  title: 'Components/Selector ',
  component: Selector
} as Meta;

const Template: Story<ISelectorProps> = (args) => {
  return (
    <div>
      <Selector {...args} />
    </div>
  );
};

export const Primary = Template.bind({});

Primary.args = {
  title: 'Choose your own adventure',
  select: <Button>The Sacrifice</Button>,
  options: [
    { value: 1, content: <div>This is option 1</div> },
    { value: 2, content: <div>This is option 2</div> },
    { value: 3, content: <div>This is option 3</div> }
  ]
};
