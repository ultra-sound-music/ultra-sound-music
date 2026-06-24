import { solana } from '@usm/app-state';
import { Button } from '@usm/ui';

const { useRedeemParticipationBid } = solana;

export interface RedeemParticipationButtonProps {
  auction: solana.AccountAddress;
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
