import { ChangeEvent, ReactElement, useEffect, useState } from 'react';

import Button from '../../Button/Button';

import styles from './BidBoxForm.scss';

export interface IBidFormBoxProps {
  minBid?: number;
  currentBid?: number;
  isWalletConnected?: boolean;
  connectButton?: ReactElement<typeof Button>;
  isProcessing?: boolean;
  onBid: (bidAmount: string) => void;
}

export function BidBoxForm({
  minBid = 0.1,
  currentBid,
  isWalletConnected,
  connectButton,
  isProcessing,
  onBid
}: IBidFormBoxProps) {
  function onChangeBidAmount(event: ChangeEvent<HTMLInputElement>) {
    setBidAmount(event.target.value);
  }

  function onClickBid() {
    onBid(bidAmount);
  }

  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    if (!isWalletConnected) {
      setBidAmount('');
    }
  }, [isWalletConnected]);

  const inputField = isWalletConnected ? (
    <input
      className={styles.bidInput}
      type='number'
      placeholder={`Bid ${minBid} SOL or more`}
      min={minBid}
      value={bidAmount}
      onChange={onChangeBidAmount}
      disabled={isProcessing}
    />
  ) : (
    <input className={styles.bidInput} type='number' value='' disabled />
  );

  const button = isWalletConnected ? (
    <Button type='primary' isDisabled={isProcessing} onClick={onClickBid}>
      Place bid
    </Button>
  ) : (
    connectButton
  );

  return (
    <form className={styles.BidBoxForm}>
      {currentBid && <div className={styles.label}>Your current Bid: {currentBid} SOL</div>}
      <div className={styles.formInputBox}>
        <div className={styles.formInput}>
          {inputField}
          <span>SOL</span>
        </div>
        {button}
      </div>
    </form>
  );
}

export default BidBoxForm;
