import { useRedeemParticipationToken, useRefundBid } from '@usm/app-state';
import { Button } from '@usm/ui';

export function EndedAuctionButton() {
  const redeemToken = useRedeemParticipationToken();

  function onClick() {
    redeemToken();
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Redeem Participation NFT
    </Button>
  );
}

export default EndedAuctionButton;
