import styles from './Styleguide.scss';

const text = 'It is true, what many of you have heard. The bots have gathered an army and as I speak, that army is drawing nearer to our home.';

export function Styleguide() {
  return (
    <div>
      <div className="typoItem">
        <h1 className={styles.h1}>{text}</h1>
      </div>
      <div className="typoItem">
        <h2 className={styles.h1}>{text}</h2>
      </div>
      <div className="typoItem">
        <h3 className={styles.h3}>{text}</h3>
      </div>
      <div className="typoItem">
        <h4 className={styles.h4}>{text}</h4>
      </div>
      <div className="typoItem">
        <div className={styles.subhead}>{text}</div>
      </div>
      <div className="typoItem">
        <div className={styles.body}>{text}</div>
      </div>
      <div className="typoItem">
        <div className={styles.small}>{text}</div>
      </div>
    </div>
  );
}

export default Styleguide;
