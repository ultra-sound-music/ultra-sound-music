import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';

import './CreateArtistButton.scss';

export class CreateArtistButton extends React.Component {
  static propTypes = {
    accountAddress: PropTypes.string,
    isProcessing: PropTypes.bool,
    name: PropTypes.string,
    description: PropTypes.string,
    createArtist: PropTypes.func
  }

  onClick = () => {
    const {
      name,
      description
    } = this.props;

    this.props.createArtist({
      name,
      description
    });
  }

  renderSpinner() {
    if (this.props.isProcessing) {
      return (
        <Spinner
          className="CreateArtistButton__spinner"
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      );
    }
  }

  isDisabled() {
    const {
      name,
    } = this.props;

    return !(name && name.length > 1);
  }  

  render() {
    return (
      <Button className='CreateArtistButton' onClick={this.onClick} disabled={this.props.isProcessing || this.isDisabled()}>{this.renderSpinner()}Create Artist</Button>
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
