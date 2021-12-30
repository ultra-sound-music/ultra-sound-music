import styles from './Typography.scss';

interface ITypographyProps {
  names: string[];
}

const text = 'It is true, what many of you have heard. The bots have gathered an army and as I speak, that army is drawing nearer to our home.';

export function Typography({ names }: ITypographyProps ) {
  return (
    <div>
      {names.map((name) => {
        return (
          <div key={name} className={styles.item}>
            <div className={styles.name}>{name}</div>
            <div className={styles.text}>{text}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Typography;
