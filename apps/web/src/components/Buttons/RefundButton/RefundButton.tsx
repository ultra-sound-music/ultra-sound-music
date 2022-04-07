import { useRefundBid, AuctionAddress } from '@usm/app-state';
import { Button } from '@usm/ui';

export interface RefundButtonProps {
  auction: AuctionAddress;
}

export function EndedAuctionButton({ auction }: RefundButtonProps) {
  const refundBid = useRefundBid(auction);

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
