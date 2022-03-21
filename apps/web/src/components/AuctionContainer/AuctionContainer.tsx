import { useNetwork, web3Constants, useIsConnected, useLoadAuction, useAccountBalance,
  useAuctionIsLoading,
  useAuction,
  usePlaceBid } from '@usm/app-state';
import { NftAuction } from '@usm/ui';
import { useEffect } from 'react';
import { Grid, Image, TraitsBox } from '@usm/ui';
import styles from './AuctionContainer.scss';
import { getShortenedAccountAddress } from '@usm/util-string';
import { BidBox, BidBoxStatus, BidBoxInfo, BidBoxForm, BidHistory, SolanaIcon } from '@usm/ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import NetworkButton from '../Buttons/NetworkButton/NetworkButton';
import EndedAuctionButton from '../Buttons/EndedAuctionButton/EndedAuctionButton';

export function AuctionContainer() {
  function onBid(bidAmount: string) {
    if (isConnected) {
      placeBid(Number.isNaN(parseFloat(bidAmount)) ? 0 : parseFloat(bidAmount));
    }
  }

  const placeBid = usePlaceBid();
  const [balance = 0] = useAccountBalance();
  const [{ accountAddress, isConnected, networkStatus }] = useNetwork();
  const { auction, isLoading, loadAuction } = useLoadAuction()

  const isConnecting = networkStatus === web3Constants.networkStatus.CONNECTING;
  const isProcessing = isConnecting || isLoading;

  const minBid = 0; // @TODO - (currentHighestBid + step) || minBid
  const currentWallet = isConnected && accountAddress ? accountAddress : undefined;
  const winningWallet = auction?.winner?.bidder?.toString();
  const highestBid = auction?.bids[0]?.bid;
  const isFinished = auction?.winner && !auction?.isLive;
  const walletBalance = balance && Math.round(balance * 10000) / 10000;
  const endedAt = auction?.endedAt || undefined;
  const isLive = auction?.isLive;
  const bids = auction?.bids.map((bid) => ({
    ...bid,
    bidder: bid.bidder.toString()
  }));


  useEffect(() => {
    const isDisconnecting = auction && !isConnected;
    if (!isDisconnecting) {
      loadAuction();
    }
  }, [isConnected]);

  const bidBoxStatusProps = {
    endedAt,
    isLive,
    currentWallet,
    winningWallet,
    bids
  };

  const bidBoxInfo1Props = {
    title: isLive ? 'Current Bid' : 'Winning Bid',
    icon: <SolanaIcon size='small' />,
    body: highestBid ? `${highestBid} SOL` : undefined
  };

  let bidBoxInfo2Props;
  if (isFinished) {
    bidBoxInfo2Props = {
      title: 'winner',
      body: getShortenedAccountAddress(winningWallet)
    };
  } else {
    if (isConnected) {
      bidBoxInfo2Props = {
        title: 'In Your Wallet',
        icon: <SolanaIcon size='small' />,
        body: `${walletBalance} SOL`
      };
    } else {
      bidBoxInfo2Props = {
        title: 'Connect Wallet'
      };
    }
  }

  let cta;
  if (isLive) {
    cta = (
      <BidBoxForm
        minBid={minBid}
        isWalletConnected={isConnected}
        connectButton={<NetworkButton />}
        isProcessing={isProcessing}
        onBid={onBid}
      />
    );
  } else {
    cta = <EndedAuctionButton />;
  }

  return (
    <Grid className={styles.AuctionContainer}>
      <div className={styles.nft}>
        <Image
          src={auction?.auctionNft?.metadata?.image}
          fit='contain'
          withPlaceholder={true}
          className={styles.nftImage}
        />
      </div>
      <div className={styles.nftAuction}>
        <NftAuction
          title={auction?.auctionNft?.metadata?.name}
          bidBox={
            <BidBox
              status={<BidBoxStatus {...bidBoxStatusProps} />}
              info={[
                <BidBoxInfo key={1} {...bidBoxInfo1Props} isLoading={isLoading} />,
                <BidBoxInfo key={2} {...bidBoxInfo2Props} isLoading={isLoading} />
              ]}
              cta={cta}
              history={<BidHistory bids={bids} isProcessing={isProcessing} />}
              isLoading={isLoading}
            />            
          }
          traitsBox={
            <TraitsBox
              description={auction?.auctionNft?.metadata?.description}
              attributes={auction?.auctionNft?.metadata?.attributes}
            />
          }
        />
      </div>
    </Grid>
  );
}

export default AuctionContainer;
