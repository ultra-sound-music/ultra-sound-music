import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@uiComponents';
import usm from '@store/usm';

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
  const isProcessing = usm.selectors.isProcessingCreateArtist(state);

  return {
    isProcessing
  };
}

export const mapDispatchToProps = {
  createArtist: usm.actions.createArtist
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateArtistButton);
