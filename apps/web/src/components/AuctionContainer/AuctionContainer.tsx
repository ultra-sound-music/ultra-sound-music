import { useEffect } from 'react';

import { solana } from '@usm/app-state';
import { urls } from '@usm/content';
import {
  Button,
  NftAuction,
  Link,
  Grid,
  Image,
  TraitsBox,
  BidBox,
  BidBoxStatus,
  BidBoxInfo,
  BidBoxForm,
  BidHistory,
  SolanaIcon
} from '@usm/ui';
import { getShortenedAccountAddress } from '@usm/util-string';
import { SolanaButton } from '@usm/components';

import RedeemBidButton from '../Buttons/RedeemBidButton/RedeemBidButton';
import RefundButton from '../Buttons/RefundButton/RefundButton';
import RedeemParticipationButton from '../Buttons/RedeemParticipationButton/RedeemParticipationButton';

import styles from './AuctionContainer.scss';

const {
  useNetworkStatus,
  useLoadAuction,
  useGetAuctions,
  useAuction,
  usePlaceBid,
  useActiveAuction,
  useAccountAddress,
  useGetWalletBalance
} = solana;

export function AuctionContainer() {
  function onBid(bidAmount: string) {
    if (isConnected) {
      placeBid(activeAuctionPk, Number.isNaN(parseFloat(bidAmount)) ? 0 : parseFloat(bidAmount));
    }
  }

  const placeBid = usePlaceBid();
  const balance = useGetWalletBalance();
  const auctions = useGetAuctions();
  const [networkStatus] = useNetworkStatus();
  const [accountAddress] = useAccountAddress();
  const [activeAuctionPk, setActiveAuction] = useActiveAuction();
  const [auction, loadingState] = useAuction(activeAuctionPk);
  const loadAuction = useLoadAuction();

  const isConnected = networkStatus === 'CONNECTED';
  const isConnecting = networkStatus === 'CONNECTING';
  const isLoading = loadingState === 'loading';
  const isProcessing = isConnecting || isLoading;
  const minBid = 0; // @TODO - (currentHighestBid + step) || minBid
  const currentAddress = isConnected && accountAddress ? accountAddress : undefined;
  const hasCompleted = auction?.state === 'ended';
  const winningWallet = hasCompleted ? auction?.bids?.[0].bidder : undefined; // we can assume there is only 1 winner
  const myBid = auction?.bids.find((bid) => bid.bidder === currentAddress);
  const iBid = !!myBid;
  const iWon = hasCompleted && winningWallet === currentAddress;
  const iLost = hasCompleted && iBid && !iWon;
  const highestBid = auction?.bids[0]?.bid;
  const walletBalance = balance && Math.round(balance * 10000) / 10000;
  const endTimestamp = auction?.endTimestamp;
  const state = auction?.state;
  const auctionIsPending = state === undefined ? undefined : state === 'created';

  useEffect(() => {
    if (isConnected && activeAuctionPk) {
      loadAuction(activeAuctionPk);
    }

    // The partial list of dependencies is ok bc a change in loadAuction has no impact on
    // whether we should load the auction or not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, activeAuctionPk]);

  const bidBoxStatusProps = {
    endTimestamp,
    state,
    currentAddress,
    bids: auction?.bids
  };

  const bidBoxInfo1Props = {
    title: state === 'created' ? '' : state === 'started' ? 'Current Bid' : 'Winning Bid',
    icon: <SolanaIcon size='small' />,
    body: highestBid ? `${highestBid} SOL` : undefined
  };

  let bidBoxInfo2Props;
  if (hasCompleted) {
    bidBoxInfo2Props = {
      title: 'winner',
      body: getShortenedAccountAddress(winningWallet)
    };
  } else {
    if (isConnected) {
      bidBoxInfo2Props = {
        title: 'In Your Wallet',
        body: `${walletBalance} SOL`
      };
    } else {
      bidBoxInfo2Props = {
        title: 'Connect Wallet'
      };
    }
  }

  let cta;
  if (iWon && !myBid?.hasBeenRedeemed) {
    cta = <RedeemBidButton auction={activeAuctionPk} />;
  } else if (iLost && !myBid.hasBeenRefunded) {
    cta = <RefundButton auction={activeAuctionPk} />;
  } else if (iLost && !myBid.hasRedeemedParticipationToken) {
    cta = <RedeemParticipationButton auction={activeAuctionPk} />;
  } else if (state === 'created') {
    cta = (
      <div>
        Connect with us on <Link to={urls.usmTwitter}>Twitter</Link> and{' '}
        <Link to={urls.usmDiscord}>Discord</Link>
      </div>
    );
  } else if (state === 'started') {
    cta = (
      <BidBoxForm
        minBid={minBid}
        isWalletConnected={isConnected}
        connectButton={<SolanaButton />}
        isProcessing={isProcessing}
        onBid={onBid}
      />
    );
  } else if (state === 'ended') {
    cta = (
      <div>
        Connect with us on <Link to={urls.usmTwitter}>Twitter</Link> and{' '}
        <Link to={urls.usmDiscord}>Discord</Link>
      </div>
    );
  } else {
    cta = <Button isProcessing={true} />;
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
          auctionIsPending={auctionIsPending}
          title={auction?.auctionNft?.metadata?.name ?? ''}
          status={<BidBoxStatus {...bidBoxStatusProps} />}
          auctions={auctions}
          setActiveAuction={setActiveAuction}
          bidBox={
            <BidBox
              info={[
                <BidBoxInfo key={1} {...bidBoxInfo1Props} isLoading={isLoading} />,
                <BidBoxInfo key={2} {...bidBoxInfo2Props} isLoading={isLoading} />
              ]}
              cta={cta}
              history={
                <BidHistory
                  bids={auction?.bids}
                  isProcessing={isProcessing}
                  currentAddress={currentAddress}
                />
              }
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
