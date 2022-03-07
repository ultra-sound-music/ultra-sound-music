import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback
} from 'recoil';

import SolClient from '@usm/sol-client';
import { USMClient, AUCTION_PUBKEY } from '@usm/sol-client';

import * as ui from '../ui';
import { localStorageEffect } from '../utils';

import * as constants from './constants';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Wallet } from '@metaplex/js';
import { USMBidData } from '@usm/sol-client';

console.log('DEBUG', 'STARTUP', 'app-state', 'web3', SolClient, USMClient);

export interface AuctionData {
  auctionData: { bids: USMBidData[]; winner?: USMBidData };
  auction: object;
  balance: number;
}

export interface IWeb3State {
  accountAddress: string;
  networkStatus: string;
  networkId: string;
  isConnected: boolean;
  auctionData: object;
}

export type IUpdateNetworkStateProps = Partial<IWeb3State>;

const solClient = new SolClient();
const connection = new Connection(clusterApiUrl('devnet'));
let USM: USMClient;

export const accountAddressState = atom<IWeb3State['accountAddress']>({
  key: 'accountAddressState',
  default: '',
  effects: [localStorageEffect<string>('accountAddress')]
});

export const networkStatusState = atom<IWeb3State['networkStatus']>({
  key: 'networkStatusState',
  default: ''
});

export const networkIdState = atom<IWeb3State['networkId']>({
  key: 'networkIdState',
  default: ''
});

export const isConnectedState = atom<IWeb3State['isConnected']>({
  key: 'isConnectedState',
  default: false
});

export const auctionDataState = atom<IWeb3State['auctionData']>({
  key: 'auctionDataState',
  default: {}
});

export function useGetAccountAddress() {
  return useRecoilValue(accountAddressState);
}

export function useGetShortenedAccountAddress() {
  const addr = useGetAccountAddress();
  console.log('DEBUG', 'useGetShortenedAccountAddress()', { addr });
  if (!addr) {
    return addr;
  } else {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
}

export function useGetNetworkStatus() {
  return useRecoilValue(networkStatusState);
}

export function useGetNetworkId() {
  return useRecoilValue(networkIdState);
}

export function useIsConnected() {
  return !!useRecoilValue(isConnectedState);
}

export function useAuctionDataState(): AuctionData {
  return useRecoilValue(auctionDataState) as AuctionData;
}

export function useUpdateNetworkStatus() {
  const setAccountAddress = useSetRecoilState(accountAddressState);
  const setNetworkStatus = useSetRecoilState(networkStatusState);
  const setNetworkId = useSetRecoilState(networkIdState);
  const setIsConnected = useSetRecoilState(isConnectedState);
  const setAuctionData = useSetRecoilState(auctionDataState);

  return function (props: IUpdateNetworkStateProps) {
    if (accountAddressState) setAccountAddress(props.accountAddress as string);
    if (networkStatusState) setNetworkStatus(props.networkStatus as string);
    if (networkIdState) setNetworkId(props.networkId as string);
    if (isConnectedState) setIsConnected(props.isConnected as boolean);
    if (auctionDataState) {
      setAuctionData(props.auctionData as object);
    }
  };
}

export function usePlaceBid(amountInSol: number) {
  return useRecoilCallback(({ snapshot }) => async () => {
    console.log('DEBUG', 'app-state', 'web3', 'usePlaceBid()', 'a)', {
      AUCTION_PUBKEY,
      amountInSol,
      solClient,
      USM
    });
    if (!amountInSol) {
      return;
    }
    const resp = await USM.placeBid(amountInSol, AUCTION_PUBKEY);
    console.log('DEBUG', 'app-state', 'web3', 'usePlaceBid()', 'b)', {
      resp,
      txId: resp?.txId,
      amountInSol
    });
  });
}

export function useConnect() {
  const showModal = ui.useShowModal();
  const updateNetworkStatus = useUpdateNetworkStatus();

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          updateNetworkStatus({
            networkStatus: constants.networkStatus.CONNECTING
          });
          const accountAddress = await solClient.connectWallet();
          console.log('DEBUG', 'app-state', 'web3', 'useConnect()', 'a)', {
            accountAddress
          });

          USM = new USMClient(connection, solClient.wallet as Wallet);
          const balance = await USM.getWalletBalance();
          const auction = await USM.getAuction(AUCTION_PUBKEY);
          const auctionData = await USM.getAuctionData(AUCTION_PUBKEY);

          updateNetworkStatus({
            accountAddress,
            networkStatus: constants.networkStatus.CONNECTED,
            networkId: '',
            isConnected: true,
            auctionData: { auction, auctionData, balance }
          });
        } catch (error) {
          updateNetworkStatus({
            networkStatus: constants.networkStatus.NOT_CONNECTED
          });

          const modalBody = 'there was an errror';
          const modalProps = {
            title: 'Failed to connect',
            body: modalBody
          };

          showModal(modalProps);
        }
      },
    []
  );
}

export function useDisconnect() {
  const showModal = ui.useShowModal();
  const updateNetworkStatus = useUpdateNetworkStatus();

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          await solClient.disconnectWallet();
          updateNetworkStatus({
            accountAddress: '',
            networkStatus: constants.networkStatus.NOT_CONNECTED,
            networkId: '',
            isConnected: false
          });
        } catch (error) {
          const modalBody = 'there was an errror';
          const modalProps = {
            title: 'Failed disconnecting',
            body: modalBody
          };

          showModal(modalProps);
        }
      },
    []
  );
}
