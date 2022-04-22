import noop from 'lodash/noop';
import config from '@usm/config';
import solanaInitializer from '../web3/solana/init';
import arweaveInitializer from '../web3/arweave/init';

export interface UseAppInitArgs {
  logo?: string;
}

const useSolanaInit = config.solana ? solanaInitializer : noop;
const useArweaveInit = config.arweave ? arweaveInitializer : noop;

export function useAppInit({ logo }: UseAppInitArgs | undefined = {}) {
  useSolanaInit();
  useArweaveInit({ appName: 'Guillermo Upload Client', logo });
}
