import noop from 'lodash-es/noop';

import { configs } from '@usm-web/configs';
import { init } from '@usm-web/solana-module';
import arweaveInitializer from '@usm-web/arweave-module';

export interface UseAppInitArgs {
  logo?: string;
}

const useSolanaInit = configs.solana ? solanaInitializer : noop;
const useArweaveInit = configs.arweave ? arweaveInitializer : noop;

export function useAppInit({ logo }: UseAppInitArgs | undefined = {}) {
  useSolanaInit();
  useArweaveInit({ appName: 'Guillermo Upload Client', logo });
}
