import { ReactElement, useEffect } from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';

import { solana, useShowModal } from '@usm/app-state';
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
  BidRedemptionStatus,
  SolanaIcon,
  NextStepProps
} from '@usm/ui';
import { getAccountUrl } from '@usm/sol-client';
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
  const showModal = useShowModal();

  const isConnected = networkStatus === 'CONNECTED';
  const isConnecting = networkStatus === 'CONNECTING';
  const isAuctionLoading = loadingState !== 'loaded';
  const isProcessing = isConnecting || isAuctionLoading;
  const currentAddress = isConnected && accountAddress ? accountAddress : undefined;
  const state = auction?.state;
  const hasCompleted = state === 'ended';
  const auctionIsPending = state === undefined ? undefined : state === 'created';
  const winningWallet = hasCompleted ? auction?.bids?.[0].bidder : undefined; // we can assume there is only 1 winner
  const myBid = auction?.bids.find((bid) => bid.bidder === currentAddress);
  const iBid = !!myBid;
  const iWon = hasCompleted && winningWallet === currentAddress;
  const iLost = hasCompleted && iBid && !iWon;
  const highestBid = auction?.bids[0]?.bid;
  const tickSize = auction?.tickSize || 0.05;
  const reserve = 0.25;
  const minBid = highestBid ? highestBid + tickSize : reserve;
  const walletBalance = balance && Math.round(balance * 10000) / 10000;
  const endTimestamp = auction?.endTimestamp;

  useEffect(() => {
    if (activeAuctionPk) {
      loadAuction(activeAuctionPk);
    }

    // The partial list of dependencies is ok bc a change in loadAuction has no impact on
    // whether we should load the auction or not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAuctionPk]);

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
    bidBoxInfo2Props = iWon
      ? {
          title: '\u00A0',
          body: 'You won!'
        }
      : {
          title: 'winner',
          body: getShortenedAccountAddress(winningWallet)
        };
  } else {
    if (isConnected && Number.isFinite(walletBalance)) {
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
  } else if (hasCompleted && iBid && !myBid.hasRedeemedParticipationToken) {
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
        currentBid={myBid?.bid}
        isWalletConnected={isConnected}
        connectButton={<SolanaButton />}
        isProcessing={isProcessing}
        onBid={onBid}
      />
    );
  } else if (state === 'ended') {
    cta = undefined;
  } else {
    cta = <Button isFullWidth={true} isProcessing={true} />;
  }

  let bidRedemptionStatus: ReactElement<typeof BidRedemptionStatus> | undefined;
  if (hasCompleted && iBid) {
    const redemptionStatusItems: NextStepProps[] = [];
    let pretext: string;
    if (iWon) {
      const redemptionIsProcessing = false; // @TODO
      const status = myBid.hasBeenRedeemed
        ? 'completed'
        : redemptionIsProcessing
        ? 'processing'
        : 'open';
      const onClick = myBid.hasBeenRedeemed
        ? undefined
        : () =>
            showModal({
              withCloseX: false,
              body: `Clicking the "Redeem NFT" button will transfer the ${auction?.auctionNft.metadata.name} NFT into your wallet.`
            });

      pretext = "Congratulations! As if winning wasn't enough.";
      redemptionStatusItems.push({
        number: 1,
        status,
        children: 'Claim your NFT',
        onClick
      });
    } else if (iLost) {
      const refundIsProcessing = false; // @TODO
      const status = myBid.hasBeenRefunded
        ? 'completed'
        : refundIsProcessing
        ? 'processing'
        : 'open';
      const onClick = () =>
        showModal({
          withCloseX: false,
          body: myBid.hasBeenRefunded
            ? `You bid of ${myBid.bid} SOL has been refunded back into your wallet.`
            : `Clicking the "Refund Bid" button will transfer your bid of ${myBid.bid} SOL back into your wallet.`
        });

      pretext = "You didn't win the auction but you're still a winner in our book!";
      redemptionStatusItems.push({
        number: 1,
        status,
        children: 'Claim a refund of your bid',
        onClick
      });
    } else {
      console.error('??');
    }

    const participationTokenRedemptionIsProcessing = false; // @TODO
    const status = myBid.hasRedeemedParticipationToken
      ? 'completed'
      : participationTokenRedemptionIsProcessing
      ? 'processing'
      : 'open';

    const onClick = () =>
      showModal({
        withCloseX: false,
        body: myBid.hasRedeemedParticipationToken ? (
          <div>
            Welcome to the USM platform. Your USM Participation NFT has been transferred to your
            wallet.
          </div>
        ) : (
          <div>
            <p>{pretext} Please accept a USM Participation NFT as a thank you for bidding.</p>
            <p>Clicking the "Redeem Gift NFT" button will transfer a gift NFT into your wallet.</p>
          </div>
        )
      });
    redemptionStatusItems.push({
      number: 2,
      status,
      children: 'Redeem gift NFT',
      onClick
    });

    bidRedemptionStatus = <BidRedemptionStatus items={redemptionStatusItems} />;
  }

  return (
    <Grid className={styles.AuctionContainer}>
      <div className={styles.nft}>
        <Link to={getAccountUrl(auction?.auctionNft?.pubKey?.toBase58() || '')}>
          <Image
            src={auction?.auctionNft?.metadata?.image}
            fit='contain'
            withPlaceholder={true}
            className={styles.nftImage}
            hoverOverlay={<RiExternalLinkLine />}
            onClick={() => null}
          />
        </Link>
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
                <BidBoxInfo key={1} {...bidBoxInfo1Props} isLoading={isAuctionLoading} />,
                <BidBoxInfo key={2} {...bidBoxInfo2Props} isLoading={false} />
              ]}
              cta={cta}
              message={bidRedemptionStatus}
              history={
                <BidHistory
                  bids={auction?.bids}
                  isProcessing={isAuctionLoading}
                  currentAddress={currentAddress}
                />
              }
              isLoading={isAuctionLoading}
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
