import { Story, Meta } from '@storybook/react';

import Carousel, { ICarouselProps } from './Carousel';

export default {
  title: 'Components/Carousel',
  component: Carousel
} as Meta<typeof Carousel>;

const Template: Story<ICarouselProps> = (args) => {
  return <Carousel {...args} />;
};

export const Primary = Template.bind({});
const children = (
  <>
    <div>Testing 1</div>
    <div>Testing 2</div>
    <div>Testing 3</div>
  </>
);

Primary.args = {
  children: children.props.children
};
