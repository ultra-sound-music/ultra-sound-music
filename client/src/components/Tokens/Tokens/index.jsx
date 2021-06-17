import React  from 'react';
import PropTypes from 'prop-types';
import TokenCard from '../TokenCard';

import './Tokens.scss';

export function Tokens (props) {
  return (
    <div className="Tokens">
      {props.tokenIds.map((id) => {
        return <div key={id}><TokenCard tokenId={id} /></div>;
      })}
    </div>
  )
}

Tokens.propTypes = {
  tokenIds: PropTypes.arrayOf(PropTypes.number)
};

export default Tokens;
