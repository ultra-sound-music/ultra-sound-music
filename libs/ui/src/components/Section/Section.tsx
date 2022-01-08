import { ReactNode } from 'react';

export interface ISectionProps {
  children: ReactNode;
}

export function Section({ children }: ISectionProps) {
  return (
    <div>
      <h1>{children}</h1>
    </div>
  );
}

export default Section;
