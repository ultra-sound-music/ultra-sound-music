import { ReactNode, ImgHTMLAttributes, MouseEventHandler } from 'react';
import { RiCameraLine } from 'react-icons/ri';
import cn from 'clsx';

import Spinner from '../Spinner/Spinner';

import BaseImage from './BaseImage';
import styles from './Image.scss';

export type IImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  image?: ReactNode;
  fit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  withPlaceholder?: boolean;
  hoverOverlay?: React.ReactNode;
  onClick?: MouseEventHandler;
};

export const Image = ({
  src,
  image,
  className,
  fit,
  alt,
  withPlaceholder = false,
  onClick,
  hoverOverlay = <RiCameraLine />,
  ...props
}: IImageProps) => {
  const classNames = cn(styles.Image, !!onClick && styles.withOverlay, className);
  const noImageToShow = !(src || image);
  const imageClassNames = cn(
    styles.image,
    fit && styles[fit],
    withPlaceholder && noImageToShow && styles.placeholder
  );

  let img;
  if (src) {
    img = <BaseImage src={src} alt={alt} className={imageClassNames} {...props} />;
  } else {
    img = <div className={imageClassNames}>{image}</div>;
  }

  return (
    <div className={classNames} onClick={onClick}>
      {img}
      {!!onClick && <div className={styles.hoverOverlay}>{hoverOverlay}</div>}
    </div>
  );
};

export default Image;
