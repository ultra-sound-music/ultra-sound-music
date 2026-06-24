import { Button } from '@usm/ui';

/* eslint-disable-next-line */
export interface EndedAuctionButtonProps {}

export function EndedAuctionButton(props: EndedAuctionButtonProps) {
  function onClick() {
    console.log();
  }

  return (
    <Button type='primary' isFullWidth={true} onClick={onClick} isProcessing={false}>
      Redeem??
    </Button>
  );
}

export default EndedAuctionButton;
