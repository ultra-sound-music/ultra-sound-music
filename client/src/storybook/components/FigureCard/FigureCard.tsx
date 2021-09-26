import React from 'react';

import { Pillbox } from '../../components';
import styles from './FigureCard.scss';

export interface IButtonProps {
  image: React.ReactNode;
  children: React.ReactNode;
}

export const FigureCard = ({ image, children }: IButtonProps): JSX.Element => {
  return (
    <Pillbox withPadding={false}>
      <figure>
        {image}
        <figcaption className={styles.figCaption}>{children}</figcaption>
      </figure>
    </Pillbox>
  );
};

export default FigureCard;
