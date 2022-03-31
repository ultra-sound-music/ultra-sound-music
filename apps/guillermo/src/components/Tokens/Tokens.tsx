import isEmpty from 'lodash/isEmpty';
import NftRowItem from '../NftRowItem/NftRowItem';

import styles from './Tokens.scss';

export interface ITokensProps {
  tokens: (string | undefined)[];
}

export function Tokens({ tokens }: ITokensProps) {
  return (
    <div className={styles.Tokens}>
      <h3>Tokens in your vault</h3>
      {isEmpty(tokens) ? (
        <h4>There aren't any tokens to display</h4>
      ) : (
        tokens
          .filter((t) => t)
          .map((token) => {
            return <NftRowItem address={token as string} />;
          })
      )}
    </div>
  );
}

export default Tokens;
