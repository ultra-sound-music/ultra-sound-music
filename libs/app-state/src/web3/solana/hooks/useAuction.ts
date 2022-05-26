import { useRecoilCallback } from 'recoil';

import logger from '@usm/util-logger';
import { TransactionInterface } from '@usm/sol-client';

import { useModal, useShowNotification } from '../../../ui';

import { AccountAddress } from '../types';
import {
  useActiveAuction,
  auctionDataByAddressState,
  auctionLoadingByAddressState
} from '../models/auctions';
import { getAuction, placeBid, redeemBid, redeemParticipationBid, cancelBid } from '../api/api';

export function usePlaceBid() {
  const [activeAuctionAddress] = useActiveAuction();
  const loadAuction = useLoadAuction();
  const { showModal } = useModal();
  const showNotification = useShowNotification();

  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (auctionAddress: AccountAddress, amountInSol: number) => {
        const auctionAtom = auctionDataByAddressState(auctionAddress);

        const auction = await snapshot.getPromise(auctionAtom);
        if (!activeAuctionAddress || !auction) {
          logger.error('Unable to place bid: auction not loaded');
          return;
        }

        const currentBid = auction?.bids[0]?.bid || 0;
        const minBid = currentBid + auction.tickSize;
        if (amountInSol <= currentBid) {
          showModal({
            withCloseX: false,
            body: `Bid must be at least ${minBid} SOL`
          });
          return;
        }

        showNotification({
          type: 'processing',
          message: 'Your bid is being processed'
        });

        const auctionLoadingAtom = auctionLoadingByAddressState(auctionAddress);
        try {
          set(auctionLoadingAtom, 'loading');
          const { confirmTransaction } = await placeBid(activeAuctionAddress, amountInSol);

          showNotification({
            title: 'Success',
            message: "Your bid's been submitted. Waiting for confirmation",
            type: 'processing'
          });

          await confirmTransaction();
          set(auctionLoadingAtom, 'loaded');
          showNotification({
            title: 'Success',
            message: 'Your bid has been recorded',
            type: 'success',
            timeout: true
          });
        } catch (error) {
          logger.error(error);
          set(auctionLoadingAtom, 'errored');
          showNotification({
            title: 'Error',
            message: 'Unable to confirm bid. Please try again',
            // @TODO
            // It is actually unknown if it succeeded or failed.
            // User should be shown the txid and instructed to check the explorer
            type: 'error'
          });
        }

        loadAuction(auctionAddress, true);
      }
  );
}

export function useLoadAuction() {
  return useRecoilCallback(
    ({ snapshot, set }) =>
      async (auctionAddress: AccountAddress, forceUpdate = false) => {
        if (!auctionAddress) {
          return;
        }

        const auctionAtom = auctionDataByAddressState(auctionAddress);
        const auction = await snapshot.getPromise(auctionAtom);
        if (auction && !forceUpdate) {
          return;
        }

        const auctionLoadingStateAtom = auctionLoadingByAddressState(auctionAddress);
        set(auctionLoadingStateAtom, 'loading');
        try {
          const newAuction = await getAuction(auctionAddress);
          if (!newAuction) {
            return;
          }

          set(auctionAtom, newAuction);
          set(auctionLoadingStateAtom, 'loaded');
        } catch (error) {
          logger.error(error);
          set(auctionLoadingStateAtom, 'errored');
        }
      }
  );
}

export function useUpdateAuction() {
  const showNotification = useShowNotification();
  const loadAuction = useLoadAuction();

  // We return a function, that calls a function that takes a function as an argument and returns a function ¯\_(ツ)_/¯
  // Sorry, this is confusing AF but the tradeoff is it centralizes all this logic in one place
  return useRecoilCallback(
    () =>
      async (
        updater: (...args: [string]) => Promise<TransactionInterface>,
        [accountAddress, ...args]: [string],
        { processingMessage, successMessage, confirmedMessage, errorMessage }
      ) => {
        showNotification({
          type: 'processing',
          message: processingMessage
        });

        try {
          const { confirmTransaction } = await updater(accountAddress, ...args);

          showNotification({
            title: 'Success',
            message: successMessage,
            type: 'processing'
          });

          await loadAuction(accountAddress, true);
          await confirmTransaction();

          showNotification({
            title: 'Success',
            message: confirmedMessage,
            type: 'success',
            timeout: 3500
          });
        } catch (error) {
          logger.error(error);
          showNotification({
            title: 'Error',
            message: errorMessage,
            type: 'error'
          });
        }
      }
  );
}

export function useRedeemBid() {
  const updateAuction = useUpdateAuction();
  const messaging = {
    processingMessage: 'Redeeming your NFT.',
    successMessage: 'Redemption Approved.  Waiting for final confirmation...',
    confirmedMessage: 'Your NFT has been redeemed!',
    errorMessage: 'Failed to redeem your NFT.  Please try again'
  };

  return (auctionAddress: AccountAddress) => updateAuction(redeemBid, [auctionAddress], messaging);
}

export function useRedeemParticipationBid() {
  const updateAuction = useUpdateAuction();
  const messaging = {
    processingMessage: 'Redeeming your participation NFT',
    successMessage: 'Redemption Approved.  Waiting for final confirmation...',
    confirmedMessage: 'Your NFT has been redeemed!',
    errorMessage: 'Failed to redeem your NFT.  Please try again'
  };

  return (auctionAddress: AccountAddress) =>
    updateAuction(redeemParticipationBid, [auctionAddress], messaging);
}

export function useRefundBid() {
  const updateAuction = useUpdateAuction();
  const messaging = {
    processingMessage: 'Processing your refund',
    successMessage: 'Refund approved.  Waiting for final confirmation',
    confirmedMessage: 'Your refund has been confirmed.',
    errorMessage: 'Failed to refund your bid.  Please try again'
  };

  return (auctionAddress: AccountAddress) => updateAuction(cancelBid, [auctionAddress], messaging);
}
