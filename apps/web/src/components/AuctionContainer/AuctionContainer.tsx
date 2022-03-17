import { useEffect, useState } from 'react';

import {
  useLoadAuction,
  useIsConnected,
  usePlaceBid,
  useNetwork,
  useAccountBalance,
  web3Constants
} from '@usm/app-state';

import { Button, Paginate, BidBox, TraitsBox } from '@usm/ui';

import ConnectButton from '../Buttons/NetworkButton/NetworkButton';

import styles from './AuctionContainer.scss';

export function AuctionContainer() {
  function onClickBidNow(bidAmount: string) {
    if (isConnected) {
      placeBid(Number.isNaN(parseFloat(bidAmount)) ? 0 : parseFloat(bidAmount));
    }
  }

  const placeBid = usePlaceBid();

  const isConnected = useIsConnected();
  const [page, setPage] = useState(0);
  const [{ networkStatus }] = useNetwork();
  const [balance] = useAccountBalance();
  const { auction, isLoading, loadAuction } = useLoadAuction();

  const isConnecting = networkStatus === web3Constants.networkStatus.CONNECTING;
  const isProcessing = isConnecting || isLoading;

  useEffect(() => {
    const isDisconnecting = auction && !isConnected;
    if (!isDisconnecting) {
      loadAuction();
    }
  }, [isConnected]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <h3 className={styles.nftName}>Jam Bot #1</h3>
        <Button
          type={page === 0 ? 'primary' : 'secondary'}
          isSmall={true}
          onClick={() => setPage(0)}
        >
          Auction
        </Button>
        <Button
          type={page === 1 ? 'primary' : 'secondary'}
          isSmall={true}
          onClick={() => setPage(1)}
        >
          Traits
        </Button>
        <Paginate />
      </div>
      {page === 0 && (
        <BidBox
          isProcessing={isProcessing}
          endedAt={auction?.endedAt || undefined}
          endsAt={auction?.endAuctionAt || undefined}
          currentHighBidSol={auction?.bids[0]?.bid}
          isWalletConnected={isConnected}
          walletBalanceSol={balance && Math.round(balance * 10000) / 10000}
          recentBids={auction?.bids}
          winningWalletAddress={auction?.winner?.bidder?.toString()}
          traits={{ name: 'Jam Bot #1' }}
          connectButton={<ConnectButton />}
          onClickBidNow={onClickBidNow}
        />
      )}
      {page === 1 && (
        <TraitsBox
          sanityCategory='insomniac'
          fameCategory='festival-regular'
          swaggerCategory='riot-starter'
          melodicCategory='choral'
          texturalCategory='jagged'
          energyCategory='relaxed'
          biographyContent={
            'Lorem ipsum dolor sit amet, conse ctetuer adipiscing elit. Aenean comm odo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et ma gnis dis parturient montes, nascetur ridiculus mus. Cum sociis natoque penatibus.'
          }
          badges={[]}
        />
      )}
    </div>
  );
}

export default AuctionContainer;
