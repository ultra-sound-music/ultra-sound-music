import React from 'react';
import cn from 'classnames';
import styles from './Hero.scss';

export type THeroSize = 'small' | 'medium' | 'large' | 'stretch';
export type THeroShape = 'round' | 'square';

import Xolotl from '@images/mock/xolotl.png';
import Mixcoatl from '@images/mock/mixcoatl.png';
import Tlaloc from '@images/mock/tlaloc.png';

const mockImages = [Xolotl, Mixcoatl, Tlaloc];
function rand(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export interface IHeroProps {
  image?: JSX.Element;
  src?: string;
  size?: THeroSize;
  shape?: THeroShape;
}

export const Hero = ({
  image,
  src,
  size = 'medium',
  shape = 'round'
}: IHeroProps): JSX.Element => {
  const rootclassNames = cn(styles.Hero, styles[size]);
  const imgClassNames = cn(styles.image, styles[shape]);

  let img;
  if (src) {
    img = <img src={src} className={imgClassNames} />;
  } else if (image) {
    img = React.cloneElement(image, { className: imgClassNames });
  } else {
    // img = '@todo - placeholder image';
    const s = mockImages[rand(0, 2)];
    img = <img src={s} className={imgClassNames} />;
  }

  return <div className={rootclassNames}>{img}</div>;
};

export default Hero;
