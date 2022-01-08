import { Story, Meta } from '@storybook/react';

import Button from '../Button/Button';
import TextBlock, { ITextBlockProps } from './TextBlock';

export default {
  title: 'Components/TextBlock',
  component: TextBlock
} as Meta<typeof TextBlock>;

const Template: Story<ITextBlockProps> = (args) => {
  const styles = {
    width: '620px'
  };

  return (
    <div style={styles}>
      <TextBlock {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  subject: 'Crypto Beats',
  title: 'ultra sound music ',
  children:
    'Once minted you can use your artist to join a band or create your own band. Up to 6 artists can participate in a band.'
};
