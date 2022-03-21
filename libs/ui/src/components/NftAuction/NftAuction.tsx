import { useState, ReactElement } from 'react';

import Button from '../Button/Button';
import Paginate from '../Paginate/Paginate';
import BidBox from '../BidBox';
import TraitsBox from '../TraitsBox/TraitsBox';

import styles from './NftAuction.scss';

export interface NftAuctionProps {
  title: string;
  bidBox: ReactElement<typeof BidBox>;
  traitsBox: ReactElement<typeof TraitsBox>;
}

export function NftAuction({ title, bidBox, traitsBox }: NftAuctionProps) {
  const [page, setPage] = useState(0);

  return (
    <div className={styles.NftAuction}>
      <div className={styles.header}>
        <h3 className={styles.nftName}>{title}</h3>
        <Button
          type={page === 0 ? 'primary' : 'inactive'}
          isSmall={true}
          onClick={() => setPage(0)}
        >
          Auction
        </Button>
        <Button
          type={page === 1 ? 'primary' : 'inactive'}
          isSmall={true}
          onClick={() => setPage(1)}
        >
          Traits
        </Button>
        <Paginate />
      </div>
      <div className={page === 0 ? styles.visible : styles.hidden}>{bidBox}</div>
      <div className={page === 1 ? styles.visible : styles.hidden}>{traitsBox}</div>
    </div>
  );
}

export default NftAuction;
