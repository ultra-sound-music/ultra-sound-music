import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Button from '../Button';

import * as Actions from '../../../redux/actions'
import * as Selectors from '../../../redux/selectors';

export class JoinBandButton extends React.Component {
  static propTypes = {
    bandId: PropTypes.number,
    canJoinBand: PropTypes.bool,
    isProcessing: PropTypes.bool,    
    joinBand: PropTypes.func
  };

  onClick = () => {
    this.props.joinBand({ bandId: this.props.bandId })
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

  render() {
    return (
      <Button className='JoinBandButton' onClick={this.onClick} disabled={!this.props.canJoinBand || this.props.isProcessing}>Join Band</Button>
    );
  }
}

export function mapStateToProps(state, { bandId }) {
  const activeArtistId = Selectors.usm.getActiveArtistId(state);
  const isProcessing = Selectors.usm.isProcessingJoinBand(state, activeArtistId);

  return {
    canJoinBand: Selectors.canJoinBand(state, bandId),
    isProcessing
  }
}

export const mapDispatchToProps = {
  joinBand: Actions.usm.joinBand
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinBandButton);
