import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from '@uiComponents';
import * as Selectors from '../../../redux/core/selectors';
import * as Actions from '../../../redux/actions';

export class StartBandButton extends React.Component {
  static propTypes = {
    isProcessing: PropTypes.bool,
    startBand: PropTypes.func
  };

  onClick = () => {
    this.props.startBand();
  };

  renderSpinner() {
    if (this.props.isProcessing) {
      return (
        <Spinner
          className='CreateArtistButton__spinner'
          as='span'
          animation='border'
          size='sm'
          role='status'
          aria-hidden='true'
        />
      );
    }
  }

  render() {
    return (
      <Button onClick={this.onClick} isProcessing={this.props.isProcessing}>
        {this.renderSpinner()}Start A Band
      </Button>
    );
  }
}

function mapStateToProps(state) {
  const activeArtistTid = Selectors.usm.getActiveArtistTid(state);
  const isProcessing = Selectors.usm.isProcessingStartBand(
    state,
    activeArtistTid
  );

  return {
    isProcessing
  };
}

const mapDispatchToProps = {
  startBand: Actions.usm.startBand
};

export default connect(mapStateToProps, mapDispatchToProps)(StartBandButton);
