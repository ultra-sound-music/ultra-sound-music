import { useRefundBid, type AccountAddress } from '@usm-web/solana-module';
import { Button } from '@usm/ui';

export interface RefundButtonProps {
  auction: AccountAddress;
}

export function EndedAuctionButton({ auction }: RefundButtonProps) {
  const refundBid = useRefundBid();

  function onClick() {
    refundBid(auction);
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Refund Bid
    </Button>
  );
}

export default EndedAuctionButton;
