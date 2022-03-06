import styles from './TraitsBox.scss';

/* eslint-disable-next-line */
export interface TraitsBoxProps {}

export function TraitsBox(props: TraitsBoxProps) {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.left}>
        <h1>Welcome to TraitsBox!</h1>
      </div>
      <div className={styles.right}>
        <h1>Welcome to TraitsBox!</h1>
      </div>
    </div>
  );
}

export default TraitsBox;
