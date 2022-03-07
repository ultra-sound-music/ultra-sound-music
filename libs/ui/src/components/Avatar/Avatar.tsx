import cn from 'clsx';

import Image, { IImageProps } from '../Image/Image';

import styles from './Avatar.scss';

export type IAvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
export type IAvatarShape = 'circle' | 'square';

export interface IAvatarProps extends IImageProps {
  size?: IAvatarSize;
  shape?: IAvatarShape;
  withPadding?: boolean;
  isLoading?: boolean;
}

export const Avatar = ({
  size,
  shape = 'circle',
  withPadding = false,
  isLoading = false,
  ...props
}: IAvatarProps): JSX.Element => {
  const classNames = cn(
    styles.Avatar,
    size && styles[size],
    styles[shape],
    withPadding && styles.withPadding
  );

  return <Image {...props} fit='cover' className={classNames} />;
};

export default Avatar;
