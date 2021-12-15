export interface IInitProps {
  web3Client: Record<string, unknown>;
}

export interface IInitAction {
  type: string;
  data: {
    web3Client: Record<string, unknown>;
  };
}

export interface ITransaction {
  method: string;
  key: string;
  transactionId: string;
  status: string;
  errorCode: string;
  errorMessage: string;
}

export interface IMint {
  tokenType: string;
  tokenId: number;
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface IUsmReducer {
  activeArtistId: string;
  activeBandId: number;
  transactions: ITransaction[];
  isFetchingTokens: boolean;
  isProcessingTransaction: boolean;
  newMints: IMint[];
}
