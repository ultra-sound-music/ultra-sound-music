import { ChangeEvent, ReactElement, useState } from 'react';

import Button from '../Button/Button';

import styles from './BidBoxForm.scss';

export interface IBidFormBoxProps {
  onSubmit: (bidAmount: string) => void;
  isWalletConnected?: boolean;
  connectButton?: ReactElement<typeof Button>;
  isProcessing?: boolean;
}

export function BidBoxForm({
  connectButton,
  onSubmit,
  isWalletConnected = false,
  isProcessing
}: IBidFormBoxProps) {
  function onClickSubmit() {
    onSubmit(bidAmount);
  }

  function onChangeBidAmount(event: ChangeEvent<HTMLInputElement>) {
    setBidAmount(event.target.value);
  }

  const [bidAmount, setBidAmount] = useState('');

  const inputField = isWalletConnected ? (
    <input
      className={styles.bidInput}
      type='number'
      placeholder='Bid more than 0.0 SOL'
      min='0.01'
      onChange={onChangeBidAmount}
      disabled={isProcessing}
    />
  ) : (
    <input className={styles.bidInput} type='number' disabled />
  );

  const button = isWalletConnected ? (
    <Button type='primary' isDisabled={isProcessing} onClick={onClickSubmit}>
      Place bid
    </Button>
  ) : (
    connectButton
  );

  return (
    <form className={styles.BidBoxForm}>
      <div className={styles.label}>Your Bid</div>
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
