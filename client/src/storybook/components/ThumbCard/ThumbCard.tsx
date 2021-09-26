import React from 'react';
import styles from './ThumbCard.scss';

export interface IThumbCardProps {
  image: React.ReactNode;
  name: string;
  description: string;
}

export const ThumbCard = ({
  image,
  name,
  description
}: IThumbCardProps): JSX.Element => {
  return (
    <div className={styles.ThumbCard}>
      <div className={styles.image}>{image}</div>
      <div className={styles.name}>{name}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default ThumbCard;
