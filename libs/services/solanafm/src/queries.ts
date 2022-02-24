import { gql } from '@apollo/client';

// This is here as a sample query.
// See https://solana.fm/explorer and https://docs.solana.fm/ for more details
export const BLOCKS = gql`
  query ($from: DateTime, $to: DateTime) {
    solana {
      blocks(date: { from: $from, to: $to }) {
        number
        hash
        fetchStatus
        timestamp
        transactions {
          fee
          status
        }
      }
    }    
  }
`;
