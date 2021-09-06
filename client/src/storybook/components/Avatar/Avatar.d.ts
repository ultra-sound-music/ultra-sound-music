/// <reference types="react" />
export declare enum ESize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}
export declare enum EShape {
  ROUND = 'round',
  SQUARE = 'square'
}
export interface IAvatarProps {
  image?: JSX.Element;
  imageUrl?: string;
  size: ESize;
  shape?: EShape;
}
export declare const Avatar: ({
  image,
  imageUrl,
  size,
  shape
}: IAvatarProps) => JSX.Element;
export default Avatar;
