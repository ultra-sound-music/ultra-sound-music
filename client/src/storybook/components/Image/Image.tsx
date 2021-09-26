import React from 'react';

export const Image = ({ ...args }: Record<string, unknown>): JSX.Element => (
  <img {...args} />
);

export default Image;
