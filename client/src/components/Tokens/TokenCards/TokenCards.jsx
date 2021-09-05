import React from 'react';
import PropTypes from 'prop-types';
import TokenCardHOC from '../TokenCardHOC';

import './TokenCards.scss';

export function Tokens(props) {
  return (
    <div className='Tokens'>
      {props.entityIds.map((id) => {
        return <TokenCardHOC key={id} entityId={id} />;
      })}
    </div>
  );
}

Tokens.propTypes = {
  entityIds: PropTypes.arrayOf(PropTypes.string)
};

export default Tokens;
