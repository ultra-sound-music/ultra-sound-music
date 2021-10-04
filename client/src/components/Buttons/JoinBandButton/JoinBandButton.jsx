import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Button from '../Button';

import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/core/selectors';

export class JoinBandButton extends React.Component {
  static propTypes = {
    entityId: PropTypes.string,
    canJoinBand: PropTypes.bool,
    isProcessing: PropTypes.bool,
    joinBand: PropTypes.func
  };

  onClick = () => {
    this.props.joinBand({ bandId: this.props.entityId });
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
      <Button
        className='JoinBandButton'
        onClick={this.onClick}
        disabled={!this.props.canJoinBand || this.props.isProcessing}
      >
        {this.renderSpinner()}Join Band
      </Button>
    );
  }
}

export function mapStateToProps(state, { entityId }) {
  const activeArtistTid = Selectors.usm.getActiveArtistTid(state);
  const bandTid = Selectors.usm.getTokenId(state, entityId);
  const isProcessing = Selectors.usm.isProcessingJoinBand(
    state,
    bandTid,
    activeArtistTid
  );

  return {
    canJoinBand: Selectors.usm.canJoinBand(state, entityId),
    isProcessing
  };
}

export const mapDispatchToProps = {
  joinBand: Actions.usm.joinBand
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinBandButton);
