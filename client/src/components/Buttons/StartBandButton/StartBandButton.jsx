import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import Button from '../Button';
import * as Selectors from '../../../redux/selectors';
import * as Actions from '../../../redux/actions';

export class StartBandButton extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    bandLeaderArtistId: PropTypes.number,
    isProcessing: PropTypes.bool,
    startBand: PropTypes.func
  }

  onClick = () => {
    const {
      name,
      description
    } = this.props;

    const {
      startBand
    } = this.props;

    startBand({
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
      <Button className='StartBandButton' onClick={this.onClick} disabled={this.isDisabled()}>{this.renderSpinner()}Start A Band</Button>
    );
  }
}

function mapStateToProps(state) {
  const accountAddress = Selectors.web3.getAccountAddress(state);
  const openTransactions = Selectors.web3.selectOpenTransactions(state);
  const isProcessing = openTransactions.some((transaction) => transaction.key === accountAddress);

  return {
    accountAddress,
    isProcessing
  };
}

const mapDispatchToProps = {
  startBand: Actions.usm.startBand
};

export default connect(mapStateToProps, mapDispatchToProps)(StartBandButton);