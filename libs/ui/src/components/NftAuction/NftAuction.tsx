import { useState, ReactElement, useEffect, useRef } from 'react';
import cn from 'clsx';

import BidBoxStatus from '../BidBox/BidBoxStatus/BidBoxStatus';
import Button from '../Button/Button';
import Paginate from '../Paginate/Paginate';
import BidBox from '../BidBox';
import TraitsBox from '../TraitsBox/TraitsBox';

import styles from './NftAuction.scss';

export interface NftAuctionProps {
  title: string;
  status: ReactElement<typeof BidBoxStatus>;
  bidBox: ReactElement<typeof BidBox>;
  traitsBox: ReactElement<typeof TraitsBox>;
  auctions: string[];
  auctionIsPending?: boolean;
  setActiveAuction(address: string): void;
}

export function NftAuction({
  title,
  status,
  bidBox,
  traitsBox,
  auctions,
  setActiveAuction,
  auctionIsPending
}: NftAuctionProps) {
  function onClickPrevious(index: number, auctionAddress: string) {
    setActiveAuction(auctionAddress);
  }

  function onClickNext(index: number, auctionAddress: string) {
    setActiveAuction(auctionAddress);
  }

  const titleRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(0);
  const [isHoveredOverTitle, setIsHoveredOverTitle] = useState<boolean>();
  const isLoading = page === undefined;
  const showStatus = page === 0 || auctionIsPending === true;
  const showButtons = auctionIsPending === false;

  useEffect(() => {
    const el = titleRef.current;
    if (!el || !title) {
      return;
    }

    const { width, height } = el.getBoundingClientRect();
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.top = el.offsetTop + 'px';
    el.style.left = el.offsetLeft + 'px';
    el.style.position = 'absolute';
  }, [title]);

  useEffect(() => {
    if (typeof auctionIsPending === 'boolean') {
      setPage(+auctionIsPending);
    }
  }, [auctionIsPending]);

  return (
    <div className={cn(styles.NftAuction)}>
      <div className={cn(styles.header, isHoveredOverTitle && styles.animate)}>
        <h3 className={styles.nftTitle}>
          <div
            className={styles.name}
            ref={titleRef}
            onMouseEnter={() => setIsHoveredOverTitle(true)}
            onMouseLeave={() => setIsHoveredOverTitle(false)}
          >
            {title}
          </div>
        </h3>
        {showButtons && (
          <>
            <Button
              type={page === 0 ? 'primary' : 'inactive'}
              isDisabled={isLoading || auctionIsPending}
              isSmall={true}
              onClick={() => setPage(0)}
            >
              Auction
            </Button>
            <Button
              type={page === 1 ? 'primary' : 'inactive'}
              isSmall={true}
              isDisabled={isLoading}
              onClick={() => setPage(1)}
            >
              Traits
            </Button>
          </>
        )}
        <Paginate startIndex={0} items={auctions} onPrev={onClickPrevious} onNext={onClickNext} />
      </div>
      {showStatus && status}
      <div className={styles.body}>
        {isLoading && <div className={styles.loading}></div>}
        <div className={page === 0 ? styles.visible : styles.hidden}>{bidBox}</div>
        <div className={page === 1 ? styles.visible : styles.hidden}>{traitsBox}</div>
      </div>
    </div>
  );
}

export default NftAuction;
