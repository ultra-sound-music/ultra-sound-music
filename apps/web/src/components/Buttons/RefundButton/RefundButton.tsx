import { useRefundBid } from '@usm/app-state';
import { Button } from '@usm/ui';

export function EndedAuctionButton() {
  const refundBid = useRefundBid();

  function onClick() {
    refundBid();
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Refund
    </Button>
  );
}

export default EndedAuctionButton;
