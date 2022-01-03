import { ImgHTMLAttributes } from 'react';

import * as styles from './Image.scss';

export type IImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const Image = ({ alt = '', ...args }: IImageProps): JSX.Element => {
  return <img alt={alt} className={styles.image} {...args} />;
};

export default Image;
