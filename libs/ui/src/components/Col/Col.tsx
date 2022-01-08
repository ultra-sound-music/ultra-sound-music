import { ReactNode } from 'react';

export interface IColProps {
  start?: string | number;
  end?: string | number;
  children: ReactNode;
}

export function Col({ start, end, children }: IColProps) {
  const styles = {
    'gridColumnStart': start,
    'gridColumnEnd': end,
  };

  return (
    <div style={styles}>
      {children}
    </div>
  );
}

export default Col;
