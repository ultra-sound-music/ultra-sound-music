import { ReactNode } from 'react';

export interface IColProps {
  start?: string | number;
  end?: string | number;
  span?: string | number;
  children?: ReactNode;
  className?: string;
}

export function Col({ start, end, span, className, children }: IColProps) {
  const styles = {
    'gridColumnStart': start,
    'gridColumnEnd': end,
    'gridColumnSpan': span,
  };

  return (
    <div style={styles} className={className}>
      {children}
    </div>
  );
}

export default Col;
