import cn from 'clsx';
import { Button } from '../Button/Button';
import Paginate from '../Paginate/Paginate';

import styles from './BidBox.scss';

/* eslint-disable-next-line */
export interface BidBoxProps {
  timeUntilAuctionEnd: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  currentHighBidSol: number;
  recentBids: {
    amountSol: number;
    userWalletAddress: string;
    timeSinceBid: {
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
    };
  }[];
  isWalletConnected: boolean;
  walletBalanceSol: number;
  isAuctionFinished: boolean;
  winningWalletAddress: string;
  traits: { [key: string]: string };
}

export const BidBox = (props: BidBoxProps): JSX.Element => (
  <div className={styles.mainContainer}>
    <div className={styles.headerContainer}>
      <h3 className={styles.nftName}>Jam Bot #1</h3>
      <Button type='primary' isSmall={true}>
        Auction
      </Button>
      <Button type='primary' isSmall={true}>
        Traits
      </Button>
      <Paginate></Paginate>
    </div>
    <div className={styles.timerContainer}>
      <p>
        Auction ends {props.timeUntilAuctionEnd.days}
        <strong> days</strong> {props.timeUntilAuctionEnd.hours}
        <strong> hours</strong> {props.timeUntilAuctionEnd.minutes}
        <strong> minutes</strong> {props.timeUntilAuctionEnd.seconds}
        <strong> seconds</strong>
      </p>
    </div>
    <div className={styles.bidBoxContainer}>
      <div className={styles.info}>
        <div className={styles.currentBid}>
          <p>Current Bid</p>
          <div className={styles.currentBidValue}>
            <h3>{props.currentHighBidSol} SOL</h3>
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
            <div className={styles.walletBalanceValue}>
              <h3>{props.walletBalanceSol} SOL</h3>
            </div>
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
                type='number'
                placeholder='Bid more than 0.0 SOL'
                disabled
              />
              <span>SOL</span>
            </div>
            <Button isDisabled type='primary'>
              Connect
            </Button>
          </div>
        </div>
      )}
      {props.isWalletConnected && !props.isAuctionFinished && (
        <div className={styles.form}>
          <p>Your Bid</p>
          <div className={styles.formInputBox}>
            <div className={styles.formInput}>
              <input
                type='number'
                placeholder='Bid more than 0.0 SOL'
                min='0.01'
              />
              <span>SOL</span>
            </div>
            <Button type='primary'>Bid now</Button>
          </div>
        </div>
      )}
    </div>
    <div className={styles.bidHistoryContainer}>
      <p>Bid history</p>
      <div className={styles.bidHistoryList}>
        {props.recentBids.map(
          ({ amountSol, userWalletAddress, timeSinceBid }) => (
            <div className={styles.bidHistoryItem}>
              <div className={styles.bidAmount}>
                <p>{amountSol} SOL</p>
              </div>
              <div className={styles.bidTime}>
                {timeSinceBid.seconds && timeSinceBid.seconds > 0 && (
                  <p>{timeSinceBid.seconds} seconds ago</p>
                )}
                {timeSinceBid.minutes && timeSinceBid.minutes > 0 && (
                  <p>{timeSinceBid.minutes} minutes ago</p>
                )}
                {timeSinceBid.hours && timeSinceBid.hours > 0 && (
                  <p>{timeSinceBid.hours} hours ago</p>
                )}
                {timeSinceBid.days && timeSinceBid.days > 0 && (
                  <p>{timeSinceBid.days} days ago</p>
                )}
              </div>
              <div className={styles.bidWalletAddress}>
                <p>{userWalletAddress}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  </div>
);

export default BidBox;
