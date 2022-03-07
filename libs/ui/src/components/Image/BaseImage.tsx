import { ImgHTMLAttributes } from 'react';

export type IBaseImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const BaseImage = ({ alt, ...props }: IBaseImageProps) => {
  return <img alt={alt} {...props} />;
};

export default BaseImage;
