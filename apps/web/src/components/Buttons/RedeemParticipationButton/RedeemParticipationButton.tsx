import { useRedeemParticipationBid, AccountAddress } from '@usm/app-state';
import { Button } from '@usm/ui';

export interface RedeemParticipationButtonProps {
  auction: AccountAddress;
}

export function RedeemParticipationButton({ auction }: RedeemParticipationButtonProps) {
  const redeemToken = useRedeemParticipationBid();

  function onClick() {
    redeemToken(auction);
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Redeem Participation NFT
    </Button>
  );
}

export default RedeemParticipationButton;
