import React  from 'react';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';

export class Token extends React.Component {  
  static propTypes = {
    match: PropTypes.object.isRequired
  };
  
  render() {
    return (
      <div className='Token'>
        This is the token page for tokenId: {this.props.match.params.tokenId}

        -- artist --
        - IMAGE
        - NAME
        - DESCRIPTION        
        [PLAYBACK]
        [CREATE BAND]
        [INVITE TO JOIN BAND]

        -- bands ---
        - IMAGE
        - NAME
        - DESCRIPTION
        - BAND MEMBERS
        - LINKS TO OTHER INCARNATIONS OF THE SAME BAND
        [JOIN BAND]
        [REQUEST TO JOIN BAND]
        [PUBLISH TRACK]

        -- track --
        - IMAGE
        - NAME
        - DESCRIPTION
        - BAND
        - PUBLISHER (artist who minted the track)
        [PLAYBACK]
      </div>      
    );
  }
}

export default withRouter(Token);
