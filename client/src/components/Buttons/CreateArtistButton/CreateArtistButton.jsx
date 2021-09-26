import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@components';
import usm from '@store/usm';
import web3 from '@store/web3';

export class CreateArtistButton extends React.Component {
  static propTypes = {
    isProcessing: PropTypes.bool,
    createArtist: PropTypes.func
  };

  onClick = () => {
    this.props.createArtist();
  };

  render() {
    return (
      <Button
        type='primary'
        onClick={this.onClick}
        isProcessing={this.props.isProcessing}
      >
        Mint an Artist
      </Button>
    );
  }
}

export function mapStateToProps(state) {
  const accountAddress = web3.selectors.getAccountAddress(state);
  const isProcessing = usm.selectors.isProcessingCreateArtist(
    state,
    accountAddress
  );

  return {
    isProcessing
  };
}

export const mapDispatchToProps = {
  createArtist: usm.actions.createArtist
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateArtistButton);
