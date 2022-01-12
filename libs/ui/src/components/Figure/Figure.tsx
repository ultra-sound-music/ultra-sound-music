import styles from './Figure.scss';

export interface IFigureProps {
  image: React.ReactNode;
  title: React.ReactNode;
  caption: React.ReactNode;
}

export const Figure = ({
  image,
  title,
  caption
}: IFigureProps): JSX.Element => {
  return (
    <figure className={styles.Figure}>
      {image && <div className={styles.image}>{image}</div>}
      {title && <div className={styles.title}>{title}</div>}
      <figcaption className={styles.figCaption}>{caption}</figcaption>
    </figure>
  );
};

export default Figure;
