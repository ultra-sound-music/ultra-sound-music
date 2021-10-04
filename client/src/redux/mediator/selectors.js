import usm from '@store/usm';
import web3 from '@store/web3';

// web3
export const getNetworkStatus = web3.selectors.getNetworkStatus;
export const getAccountAddress = web3.selectors.getAccountAddress;

// usm
export const getTokenAudioUrl = usm.selectors.getTokenAudioUrl;
