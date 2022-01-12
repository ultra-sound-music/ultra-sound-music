import styles from './Input.scss';

export interface IInputProps {
  label: React.ReactNode;
}

export function Input({ label, ...props }: IInputProps) {
  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}
      <input {...props} />
    </div>
  );
}

export default Input
