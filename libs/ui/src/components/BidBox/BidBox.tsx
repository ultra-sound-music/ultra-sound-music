import { ReactNode } from 'react';
import cn from 'clsx';

import Button from '../Button/Button';
import SolanaIcon from '../Icons/SolanaIcon/SolanaIcon';

import styles from './BidBox.scss';
import BidHistory, { IBidHistoryItem } from '../BidHistory/BidHistory';

export interface BidBoxProps {
  timeUntilAuctionEnd?: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  };
  currentHighBidSol?: number;
  recentBids?: IBidHistoryItem[];
  isWalletConnected: boolean;
  walletBalanceSol?: number;
  isAuctionFinished: boolean;
  winningWalletAddress: string;
  traits: { [key: string]: string };
  isProcessing?: boolean;
  connectButton?: ReactNode;
  onClickBidNow: () => void;
  onChangeBidAmount: (value: string) => void;
}

export const BidBox = (props: BidBoxProps) => (
  <div className={cn(styles.BidBox, props.isProcessing && styles.processing)}>
    <div className={styles.timerContainer}>
      {!!props.timeUntilAuctionEnd &&
        !!Object.keys(props.timeUntilAuctionEnd).length && (
          <p>
            Auction ends {props.timeUntilAuctionEnd.days}
            <strong> days</strong> {props.timeUntilAuctionEnd.hours}
            <strong> hours</strong> {props.timeUntilAuctionEnd.minutes}
            <strong> minutes</strong> {props.timeUntilAuctionEnd.seconds}
            <strong> seconds</strong>
          </p>
        )}
    </div>
    <div className={styles.bidFormContainer}>
      <div className={styles.info}>
        <div className={styles.currentBid}>
          <p>Current Bid</p>
          <div className={styles.currentBidValue}>
            {!!props.currentHighBidSol && (
              <h3>{props.currentHighBidSol} SOL</h3>
            )}
          </div>
        </div>
        {!props.isWalletConnected && !props.isAuctionFinished && (
          <div className={styles.walletBalance}>
            <p>Connect a Wallet</p>
            <div className={styles.walletBalanceValue}>
              <h2>-</h2>
            </div>
          </div>
        )}
        {props.isWalletConnected && !props.isAuctionFinished && (
          <div className={styles.walletBalance}>
            <p>In your wallet</p>
            {!!props.walletBalanceSol && (
              <div className={styles.walletBalanceValue}>
                <SolanaIcon size='small' />
                <div className={styles.balanceAmount}>
                  {props.walletBalanceSol} SOL
                </div>
              </div>
            )}
          </div>
        )}
        {props.isAuctionFinished && (
          <div className={styles.walletBalance}>
            <p>Winner</p>
            <div className={styles.walletBalanceValue}>
              <h2>{props.winningWalletAddress}</h2>
            </div>
          </div>
        )}
      </div>
      {!props.isWalletConnected && !props.isAuctionFinished && (
        <div className={styles.form}>
          <p>Your Bid</p>
          <div className={styles.formInputBox}>
            <div className={styles.formInput}>
              <input
                className={styles.bidInput}
                type='number'
                placeholder='Bid more than 0.0 SOL'
                disabled
              />
              <span>SOL</span>
            </div>
            {props.connectButton}
          </div>
        </div>
      )}
      {props.isWalletConnected && !props.isAuctionFinished && (
        <div className={styles.form}>
          <p>Your Bid</p>
          <div className={styles.formInputBox}>
            <div className={styles.formInput}>
              <input
                className={styles.bidInput}
                type='number'
                placeholder='Bid more than 0.0 SOL'
                min='0.01'
                onChange={(e) => props.onChangeBidAmount(e.target.value)}
                disabled={props.isProcessing}
              />
              <span>SOL</span>
            </div>
            <Button
              type='primary'
              isDisabled={props.isProcessing}
              onClick={props.onClickBidNow}
            >
              Place bid
            </Button>
          </div>
        </div>
      )}
    </div>
    <BidHistory bids={props.recentBids} isProcessing={!!props.isProcessing} />
  </div>
);

export default BidBox;
