import { Story, Meta } from '@storybook/react';

import Paginate, { IPaginateProps } from './Paginate';

export default {
  title: 'Components/Paginate',
  component: Paginate
} as Meta<typeof Paginate>;

const Template: Story<IPaginateProps> = (args) => {
  return <Paginate {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  onClickPrev: () => {
    console.log('TEST');
  },
  onClickNext: () => {
    console.log('TEST');
  }
};
