import { Story, Meta } from '@storybook/react';

import MusicalTrait, { IMusicalTraitProps } from './MusicalTrait';

export default {
  title: 'Components/MusicalTrait',
  component: MusicalTrait
} as Meta;

const Template: Story<IMusicalTraitProps> = (args) => <MusicalTrait {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  name: 'energy',
  value: 'aggressive'
};
