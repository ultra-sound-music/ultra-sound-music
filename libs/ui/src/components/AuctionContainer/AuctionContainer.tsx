import {
  useAuctionDataState,
  useIsConnected,
  usePlaceBid
} from '@usm/app-state';
import { useState } from 'react';
import { Button } from '../Button/Button';
import Paginate from '../Paginate/Paginate';
import BidBox from '../BidBox/BidBox';
import TraitsBox from '../TraitsBox/TraitsBox';

import styles from './AuctionContainer.scss';

/* eslint-disable-next-line */
export interface AuctionContainerProps {}

export function AuctionContainer(props: AuctionContainerProps) {
  const [bidAmount, setBidAmount] = useState('');
  const placeBid = usePlaceBid(
    Number.isNaN(parseFloat(bidAmount)) ? 0 : parseFloat(bidAmount)
  );
  const isConnected = useIsConnected();

  function onClickBidNow() {
    console.log('onClickBidNow()', { isConnected });
    if (isConnected) {
      placeBid();
    }
  }

  const [page, setPage] = useState(0);

  const auctionData = useAuctionDataState();
  console.log('AuctionContainer', {
    balance: auctionData?.balance,
    bids: auctionData?.auctionData?.bids,
    auctionData
  });

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
        <Paginate></Paginate>
      </div>
      {page === 0 && (
        <BidBox
          timeUntilAuctionEnd={{}}
          currentHighBidSol={auctionData?.auctionData?.bids[0]?.bid}
          isWalletConnected={!!auctionData?.balance}
          walletBalanceSol={auctionData?.balance}
          recentBids={auctionData?.auctionData?.bids}
          isAuctionFinished={!!auctionData?.auctionData?.winner}
          winningWalletAddress='0x1ds...sdfsa'
          traits={{ name: 'Jam Bot #1' }}
          onClickBidNow={onClickBidNow}
          onChangeBidAmount={(value) => setBidAmount(value)}
        />
      )}
      {page === 1 && (
        <TraitsBox
          sanityCategory={'insomniac'}
          fameCategory={'festival-regular'}
          swaggerCategory={'riot-starter'}
          melodicCategory={'choral'}
          texturalCategory={'jagged'}
          energyCategory={'relaxed'}
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
