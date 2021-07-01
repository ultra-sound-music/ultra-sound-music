import React  from 'react';
import PropTypes from 'prop-types';
import TokenCardHOC from '../TokenCardHOC';

import './TokenCards.scss';

export function Tokens (props) {
  return (
    <div className="Tokens">
      {props.tokenIds.map((id) => {
        return <TokenCardHOC key={id} tokenId={id} />
      })}
    </div>
  )
}

Tokens.propTypes = {
  tokenIds: PropTypes.arrayOf(PropTypes.number)
};

export default Tokens;
