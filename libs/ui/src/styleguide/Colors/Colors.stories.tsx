import { Story, Meta } from '@storybook/react';
import Colors from './Colors';

const colors = [
  'taffy',
  'lavish',
  'break-water',
  'old-towel',
  'sassy',
  'dawn',
  'dusk',
  'evening-sky',
  'night-sky',
  'empty-sky',
  'polar-bear',
  'nothing',
  'void'
];

const gradients = [
  'brilliant'
]

export default {
  component: Colors,
  title: 'Styleguide/Colors',
} as Meta;

const Template: Story = () => <Colors  colors={colors} gradients={gradients} />;

export const Primary = Template.bind({});
Primary.args = {};
