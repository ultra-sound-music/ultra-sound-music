import { BrowserRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';

import SiteFooter from './SiteFooter';

export default {
  title: 'Components/SiteFooter',
  component: SiteFooter
} as Meta;

const Template: Story = (args) => {
  return (
    <BrowserRouter>
      <SiteFooter {...args} />
    </BrowserRouter>
  );
};

export const Primary = Template.bind({});
