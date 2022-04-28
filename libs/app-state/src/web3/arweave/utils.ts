export interface SetArweaveUtilConfigsArgs {
  protocol: string;
  host: string;
  port: string;
}

let protocol: string;
let host: string;
let port: string;
export const WINSTONS_PER_AR = 1000000000000;

export function setOrigin({ protocol: pr, host: h, port: po }: SetArweaveUtilConfigsArgs) {
  protocol = pr;
  host = h;
  port = po;
}

export function getArweaveOrigin() {
  const portString = port ? `:${port}` : '';
  return `${protocol}://${host}${portString}`;
}

export function getArweaveUrl(id: string) {
  return `${getArweaveOrigin()}/${id}`;
}

export async function airdropAR(account?: string, amount = 1): Promise<number> {
  if (host.includes('localhost')) {
    console.error('You can only airdrop AR locally');
  }

  if (account) {
    console.error('Unable to airdrop AR: An account must be specified');
  }

  const origin = getArweaveOrigin();
  const response = await fetch(`${origin}/mint/${account}/${WINSTONS_PER_AR * amount}`);

  fetch(`${origin}/mine`);
  return +response.text();
}
