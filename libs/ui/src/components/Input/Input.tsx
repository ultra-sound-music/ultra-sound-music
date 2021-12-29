/* eslint-disable-next-line */
export interface IInputProps {}

export function Input(props: IInputProps) {
  return (
    <div>
      <input {...props} />
    </div>
  );
}

export default Input;
