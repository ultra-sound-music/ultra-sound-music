import { BrowserRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import Button from './Button';

export default {
  title: 'Component/Button',
  component: Button
} as Meta<typeof Button>;

const Template: Story<typeof Button> = (args) => {
  return (
    <BrowserRouter>
      <Button {...args} />
    </BrowserRouter>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  children: 'Button'
};
