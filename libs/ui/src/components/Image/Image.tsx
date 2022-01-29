import { ImgHTMLAttributes } from 'react';

export type IImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const Image = ({ alt = '', ...args }: IImageProps): JSX.Element => {
  return <img alt={alt} {...args} />;
};

export default Image;
