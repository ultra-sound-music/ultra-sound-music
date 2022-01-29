import { Story, Meta } from '@storybook/react';

import CollectionStamp from './CollectionStamp';

export default {
  title: 'Components/CollectionStamp ',
  component: CollectionStamp
} as Meta;

const Template: Story = (args) => {
  return <CollectionStamp {...args} />;
};

export const Basic = Template.bind({});
