import { useRedeemBid, AccountAddress } from '@usm/app-state';
import { Button } from '@usm/ui';

export interface EndedAuctionButtonProps {
  auction: AccountAddress;
}

export function EndedAuctionButton({ auction }: EndedAuctionButtonProps) {
  const redeemBid = useRedeemBid(auction);

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
