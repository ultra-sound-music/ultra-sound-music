import { ReactElement } from 'react';
import cn from 'clsx';

import { getShortenedAccountAddress } from '@usm/util-string';

import Button from '../Button/Button';
import SolanaIcon from '../Icons/SolanaIcon/SolanaIcon';

import styles from './BidBox.scss';
import BidHistory, { IBidHistoryItem } from '../BidHistory/BidHistory';
import { BidBoxForm } from './BidBoxForm';
import { BidBoxInfo } from './BidBoxInfo';
import { BidBoxStatus } from './BidBoxStatus';

export interface BidBoxProps {
  endedAt?: EpochTimeStamp;
  endsAt?: EpochTimeStamp;
  currentHighBidSol?: number;
  recentBids?: IBidHistoryItem[];
  isWalletConnected: boolean;
  walletBalanceSol?: number;
  winningWalletAddress?: string;
  traits: { [key: string]: string };
  isProcessing?: boolean;
  connectButton?: ReactElement<typeof Button>;
  onClickBidNow: (amountInSol: string) => void;
}

export const BidBox = (props: BidBoxProps) => {
  const isAuctionFinished = !!props.winningWalletAddress;

  return (
    <div className={cn(styles.BidBox, props.isProcessing && styles.processing)}>
      <BidBoxStatus endsAt={props.endsAt} endedAt={props.endedAt} />
      <div className={styles.bidFormContainer}>
        <div className={styles.info}>
          <BidBoxInfo title='Current Bid' icon={<SolanaIcon size='small' />}>
            {props.currentHighBidSol} SOL
          </BidBoxInfo>
          {!props.isWalletConnected && !isAuctionFinished && (
            <BidBoxInfo title='Connect Wallet'>-</BidBoxInfo>
          )}
          {props.isWalletConnected && !isAuctionFinished && (
            <BidBoxInfo
              title='In your wallet'
              icon={<SolanaIcon size='small' />}
            >
              {props.walletBalanceSol} SOL
            </BidBoxInfo>
          )}
          {isAuctionFinished && (
            <BidBoxInfo title='Winner'>
              {getShortenedAccountAddress(props.winningWalletAddress)}
            </BidBoxInfo>
          )}
        </div>
        {!isAuctionFinished && (
          <BidBoxForm
            onSubmit={props.onClickBidNow}
            isWalletConnected={props.isWalletConnected}
            isProcessing={props.isProcessing}
            connectButton={props.connectButton}
          />
        )}
      </div>
      <BidHistory bids={props.recentBids} isProcessing={!!props.isProcessing} />
    </div>
  );
};

export default BidBox;
