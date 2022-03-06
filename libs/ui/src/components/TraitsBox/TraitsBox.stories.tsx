import { Story, Meta } from '@storybook/react';
import { TraitsBox, TraitsBoxProps } from './TraitsBox';

export default {
  component: TraitsBox,
  title: 'Components/TraitsBox'
} as Meta;

const Template: Story<TraitsBoxProps> = (args) => <TraitsBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
