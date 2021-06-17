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

        <h2>-- artist --</h2>
        <div>- IMAGE</div>
        <div>- NAME</div>
        <div>- DESCRIPTION</div>
        <div>[PLAYBACK]</div>
        <div>[CREATE BAND]</div>
        <div>[INVITE TO JOIN BAND]</div>

        <h2>-- bands --</h2>
        <div>- IMAGE</div>
        <div>- NAME</div>
        <div>- DESCRIPTION</div>
        <div>- BAND MEMBERS</div>
        <div>- LINKS TO OTHER INCARNATIONS OF THE SAME BAND</div>
        <div>[JOIN BAND]</div>
        <div>[REQUEST TO JOIN BAND]</div>
        <div>[PUBLISH TRACK]</div>

        <h2>-- track --</h2>
        <div>- IMAGE</div>
        <div>- NAME</div>
        <div>- DESCRIPTION</div>
        <div>- BAND</div>
        <div>- PUBLISHER (artist who minted the track)</div>
        <div>[PLAYBACK]</div>
      </div>      
    );
  }
}

export default withRouter(Token);
