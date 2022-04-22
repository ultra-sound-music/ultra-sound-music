import { useRedeemBid, AccountAddress } from '@usm/app-state';
import { Button } from '@usm/ui';

export interface EndedAuctionButtonProps {
  auction: AccountAddress;
}

export function EndedAuctionButton({ auction }: EndedAuctionButtonProps) {
  const redeemBid = useRedeemBid();

  function onClick() {
    redeemBid(auction);
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Redeem
    </Button>
  );
}

export default EndedAuctionButton;
