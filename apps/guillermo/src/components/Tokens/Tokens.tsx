import isEmpty from 'lodash/isEmpty';
import { AuctionItemProgress, AuctionItemProgressStatus } from '../../state/tokens';

import styles from './Tokens.scss';

export interface ITokensProps {
  auctionsProgress?: AuctionItemProgress[];
}

export function Tokens({ auctionsProgress }: ITokensProps) {
  return (
    <div className={styles.Tokens}>
      <h3>Tokens in your store</h3>
      {isEmpty(auctionsProgress) ? (
        <h4>There aren't any tokens to display</h4>
      ) : (
        auctionsProgress
          ?.filter((t) => t)
          .map((progress) => {
            return (
              <div>
                <div>
                  [state: {AuctionItemProgressStatus[progress.status]}]{' '}
                  {progress.mintAddress || progress.metadataUrl}
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}

export default Tokens;
