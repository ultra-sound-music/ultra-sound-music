import { solana } from '@usm/app-state';
import { Button } from '@usm/ui';

const { useRedeemBid } = solana;

export interface EndedAuctionButtonProps {
  auction: solana.AccountAddress;
}

export function EndedAuctionButton({ auction }: EndedAuctionButtonProps) {
  const redeemBid = useRedeemBid();

  function onClick() {
    redeemBid(auction);
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Redeem NFT
    </Button>
  );
}

export default EndedAuctionButton;
