export interface INftRowItemProps {
  address: string;
}

export function NftRowItem({ address }: INftRowItemProps) {
  return <div>{address}</div>;
}

export default NftRowItem;
