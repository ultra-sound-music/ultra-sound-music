import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import * as Actions from '../../../redux/actions';

export class ConnectButton extends React.Component {
  static propTypes = {
    connectWallet: PropTypes.func    
  };

  onClick = () => {
    this.props.connectWallet();
  }

  render() {
    return <Button onClick={this.onClick} className='ConnectButton'>Connect</Button>;    
  }
}

const mapDispatchToProps = {
  connectWallet: Actions.web3.connectWallet
};

export default connect(null, mapDispatchToProps)(ConnectButton);