import * as solClient from '@usm/sol-client';

const global = window as any;
export function Sandbox() {
  Object.assign(global, {
    ...solClient
  });

  return <div></div>;
}

export default Sandbox;
