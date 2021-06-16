import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';

export class CreateArtistButton extends React.Component {
  static propTypes = {
    accountAddress: PropTypes.string,
    isProcessing: PropTypes.bool,
    getArtistData: PropTypes.func,
    createArtist: PropTypes.func
  }

  onClick = () => {
    this.props.createArtist(this.props.getArtistData());
  }

  renderSpinner() {
    if (this.props.isProcessing) {
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    }
  }

  render() {
    return (
      <Button onClick={this.onClick} disabled={this.props.isProcessing}>{this.renderSpinner()}Create Artist</Button>
    );
  }
}

export function mapStateToProps(state) {
  const accountAddress = Selectors.web3.getAccountAddress(state);
  const openTransactions = Selectors.web3.selectOpenTransactions(state);
  const isProcessing = openTransactions.some((transaction) => transaction.key === accountAddress);

  return {
    accountAddress,
    isProcessing
  };
}

export const mapDispatchToProps = {
  createArtist: Actions.usm.createArtist,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateArtistButton);