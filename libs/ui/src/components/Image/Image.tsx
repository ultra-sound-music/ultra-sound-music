import { ReactNode, ImgHTMLAttributes, MouseEventHandler } from 'react';
import { RiCameraLine } from 'react-icons/ri';
import cn from 'clsx';

import BaseImage from './BaseImage';
import styles from './Image.scss';

export type IImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  image?: ReactNode;
  fit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  hoverOverlay?: React.ReactNode;
  onClick?: MouseEventHandler;
};

export const Image = ({
  src,
  image,
  className,
  fit,
  alt,
  onClick,
  hoverOverlay = <RiCameraLine />,
  ...props
}: IImageProps) => {
  const classNames = cn(
    styles.Image,
    !!onClick && styles.withOverlay,
    className
  );
  const imageClassNames = cn(styles.image, fit && styles[fit]);

  return (
    <div className={classNames} onClick={onClick}>
      {!src && image ? (
        <div className={imageClassNames}>{image}</div>
      ) : (
        <BaseImage src={src} alt={alt} className={imageClassNames} {...props} />
      )}
      {!!onClick && <div className={styles.hoverOverlay}>{hoverOverlay}</div>}
    </div>
  );
};

export default Image;
