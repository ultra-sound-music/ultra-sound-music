import React from 'react';
import cn from 'classnames';
import styles from './Avatar.scss';

export enum ESize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum EShape {
  ROUND = 'round',
  SQUARE = 'square'
}

export interface IAvatarProps {
  image?: JSX.Element;
  imageUrl?: string;
  size?: ESize;
  shape?: EShape;
}

export const Avatar = ({
  image,
  imageUrl,
  size = ESize.SMALL,
  shape = EShape.ROUND
}: IAvatarProps): JSX.Element => {
  const rootclassNames = cn(styles.Avatar, styles[size]);
  const imgClassNames = cn(styles.image, styles[shape]);

  let img;
  if (imageUrl) {
    img = <img src={imageUrl} className={imgClassNames} />;
  } else if (image) {
    img = React.cloneElement(image, { className: imgClassNames });
  } else {
    img = '@todo - placeholder image';
  }

  return <div className={rootclassNames}>{img}</div>;
};

export default Avatar;
