import { useRedeemBid } from '@usm/app-state';
import { Button } from '@usm/ui';

export function EndedAuctionButton() {
  const redeemBid = useRedeemBid();

  function onClick() {
    redeemBid();
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Redeem
    </Button>
  );
}

export default EndedAuctionButton;
