import { useIsConnected, usePlaceBid } from '@usm/app-state';
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
          timeUntilAuctionEnd={{
            days: 0,
            hours: 21,
            minutes: 46,
            seconds: 11
          }}
          currentHighBidSol={173.5}
          isWalletConnected={true}
          walletBalanceSol={512.12}
          recentBids={[
            {
              amountSol: 173.5,
              userWalletAddress: '0x123',
              timeSinceBid: { seconds: 19 }
            },
            {
              amountSol: 101.0,
              userWalletAddress: '0xvasd12asd3',
              timeSinceBid: { minutes: 45 }
            }
          ]}
          isAuctionFinished={false}
          winningWalletAddress='0x1ds...sdfsa'
          traits={{ name: 'Jam Bot #1' }}
          onClickBidNow={onClickBidNow}
          onChangeBidAmount={(value) => setBidAmount(value)}
        />
      )}
      {page === 1 && <TraitsBox />}
    </div>
  );
}

export default AuctionContainer;
