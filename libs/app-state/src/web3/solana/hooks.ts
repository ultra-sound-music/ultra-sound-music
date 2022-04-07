import { useEffect } from 'react';
import { useRecoilCallback, useResetRecoilState, useSetRecoilState } from 'recoil';

import { useModal, useShowNotification } from '../../ui';
import {
  useActiveAuction,
  useAuction,
  useAuctionLoadingState,
  AuctionAddress,
  UpdateAuctionCallbackArgs
} from './models/auctions';

import {
  networkStatusState,
  accountAddressState,
  useAccountBalance,
  useNetworkStatus,
  useAccountAddress
} from './models/wallet';
import {
  getAuction,
  placeBid,
  connectWallet,
  disconnectWallet,
  getWalletBalance,
  redeemBid,
  redeemParticipationBid,
  cancelBid
} from './api';

export function useConnect() {
  const showNotification = useShowNotification();
  const setNetworkStatus = useSetRecoilState(networkStatusState);
  const setAccountAddress = useSetRecoilState(accountAddressState);
  return useRecoilCallback(() => async () => {
    try {
      setNetworkStatus('CONNECTING');
      const walletAddress = await connectWallet();
      setAccountAddress(walletAddress);
      setNetworkStatus('CONNECTED');
    } catch (error) {
      setNetworkStatus('ERRORED');
      showNotification({
        title: 'Error',
        message: 'Failed to connect',
        type: 'error'
      });
    }
  });
}

export function useDisconnect() {
  const updateNetworkStatus = useSetRecoilState(networkStatusState);
  const resetWalletAddress = useResetRecoilState(accountAddressState);
  const showNotification = useShowNotification();

  return useRecoilCallback(
    () => async () => {
      try {
        await disconnectWallet();
        updateNetworkStatus('NOT_CONNECTED');
        resetWalletAddress();
      } catch (error) {
        console.error(error);
        showNotification({
          title: 'Error',
          type: 'error'
        });
      }
    },
    []
  );
}

export function useGetWalletBalance() {
  const [walletBalance, setWalletBalance] = useAccountBalance();
  const [networkStatus] = useNetworkStatus();
  const walletAddress = useAccountAddress();

  useEffect(() => {
    if (networkStatus === 'CONNECTED') {
      getWalletBalance().then((balance) => {
        setWalletBalance(balance);
      });
    }
  }, [networkStatus, walletAddress]);

  return walletBalance;
}

export function useLoadAuction(auctionAddress: AuctionAddress) {
  const [loadingState, setLoadingState] = useAuctionLoadingState(auctionAddress);
  const [auction, setAuction] = useAuction(auctionAddress);

  const loadAuction = useRecoilCallback(() => async () => {
    if (!auctionAddress) {
      return;
    }

    try {
      setLoadingState('loading');
      const auction = await getAuction(auctionAddress);
      setAuction(auction);
      setLoadingState('loaded');
    } catch (error) {
      console.error(error);
      setLoadingState('errored');
    }
  });

  return { loadAuction, auction, loadingState };
}

export function usePlaceBid() {
  const [activeAuctionAddress] = useActiveAuction();
  const [_, setLoadingState] = useAuctionLoadingState(activeAuctionAddress || '');
  const { loadAuction, auction } = useLoadAuction(activeAuctionAddress || '');
  const { showModal } = useModal();
  const showNotification = useShowNotification();

  return useRecoilCallback(() => async (amountInSol: number) => {
    if (!activeAuctionAddress || !auction) {
      console.error('Unable to place bid: auction not loaded');
      return;
    }

    const currentBid = auction?.bids[0]?.bid || 0;
    if (amountInSol <= currentBid) {
      showModal({
        withCloseX: false,
        body: 'Bid must be greater than the top bid'
      });
      return;
    }

    showNotification({
      type: 'processing',
      message: 'Your bid is being processed'
    });

    try {
      setLoadingState('loading');
      const { confirmTransaction } = await placeBid(activeAuctionAddress, amountInSol);

      showNotification({
        title: 'Success',
        message: 'Your bid has been placed. Waiting for final confirmation',
        type: 'processing'
      });

      await confirmTransaction();
      setLoadingState('loaded');
      showNotification({
        title: 'Success',
        message: 'Your bid has been recorded',
        type: 'success'
      });
    } catch (error) {
      setLoadingState('errored');
      console.error(error);
      showNotification({
        title: 'Error',
        message: 'Failed to placing bid.  Please try again',
        type: 'error'
      });
    }

    loadAuction();
  });
}

export async function updateAuctionCallback({
  updater,
  processingMessage,
  successMessage,
  confirmedMessage,
  errorMessage,
  loadAuction,
  showNotification
}: UpdateAuctionCallbackArgs) {
  showNotification({
    type: 'processing',
    message: processingMessage
  });

  try {
    const { confirmTransaction } = await updater();

    showNotification({
      title: 'Success',
      message: successMessage,
      type: 'processing'
    });

    await loadAuction(true);
    await confirmTransaction();

    showNotification({
      title: 'Success',
      message: confirmedMessage,
      type: 'success',
      timeout: 3500
    });
  } catch (error) {
    console.error(error);
    showNotification({
      title: 'Error',
      message: errorMessage,
      type: 'error'
    });
  }
}

export function useUpdateAuction(auctionAddress: AuctionAddress) {
  const showNotification = useShowNotification();
  const { loadAuction } = useLoadAuction(auctionAddress);

  // We return a function, that calls a function that takes a function as an argument and returns a function ¯\_(ツ)_/¯
  // Sorry, this is confusing AF but the tradeoff is it centralizes all this logic in one place
  return (args: Omit<UpdateAuctionCallbackArgs, 'showNotification' | 'loadAuction'>) =>
    useRecoilCallback(() => async () => {
      updateAuctionCallback({ showNotification, loadAuction, ...args });
    });
}

export function useRedeemBid(auctionAddress: AuctionAddress) {
  const updateAuction = useUpdateAuction(auctionAddress);

  return updateAuction({
    updater: () => redeemBid(auctionAddress),
    processingMessage: 'Redeeming your NFT.',
    successMessage: 'Redemption Approved.  Waiting for final confirmation...',
    confirmedMessage: 'Your NFT has been redeemed!',
    errorMessage: 'Failed to redeem your NFT.  Please try again'
  });
}

export function useRedeemParticipationBid(auctionAddress: AuctionAddress) {
  const updateAuction = useUpdateAuction(auctionAddress);
  return updateAuction({
    updater: () => redeemParticipationBid(auctionAddress),
    processingMessage: 'Redeeming your participation NFT',
    successMessage: 'Redemption Approved.  Waiting for final confirmation...',
    confirmedMessage: 'Your NFT has been redeemed!',
    errorMessage: 'Failed to redeem your NFT.  Please try again'
  });
}

export function useRefundBid(auctionAddress: AuctionAddress) {
  const updateAuction = useUpdateAuction(auctionAddress);
  return updateAuction({
    updater: () => cancelBid(auctionAddress),
    processingMessage: 'Processing your refund',
    successMessage: 'Refund approved.  Waiting for final confirmation',
    confirmedMessage: 'Your refund has been confirmed.',
    errorMessage: 'Failed to refund your bid.  Please try again'
  });
}
