import { useRedeemParticipationBid, AuctionAddress } from '@usm/app-state';
import { Button } from '@usm/ui';

export interface RedeemParticipationButtonProps {
  auction: AuctionAddress;
}

export function RedeemParticipationButton({ auction }: RedeemParticipationButtonProps) {
  const redeemToken = useRedeemParticipationBid(auction);

  function onClick() {
    redeemToken();
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Redeem Participation NFT
    </Button>
  );
}

export default RedeemParticipationButton;
