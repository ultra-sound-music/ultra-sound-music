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
      </div>      
    );
  }
}

export default withRouter(Token);
