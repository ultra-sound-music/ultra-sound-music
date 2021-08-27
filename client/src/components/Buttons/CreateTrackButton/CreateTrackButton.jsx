import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';

export class CreateTrackButton extends React.Component {
  static propTypes = {
    bandId: PropTypes.string,
    canActiveArtistCreateTrackForBand: PropTypes.bool,
    createTrack: PropTypes.func,
    name: PropTypes.string,
    description: PropTypes.string
  }

  onClick = () => {
    const {
      name,
      description,
      bandId
    } = this.props;

    if (this.props.canActiveArtistCreateTrackForBand) {
      this.props.createTrack({bandId, name: `${Math.random().toString(36).substring(7)} ${Math.random().toString(36).substring(4)}`, description: 'Some description'});
    } else {
      // Show information modal
    }
  }

  isDisabled() {
    return !(this.props.canActiveArtistCreateTrackForBand);
  }

  render() {
    return <Button onClick={this.onClick} disabled={this.isDisabled()}>Create Track</Button>
  }
}

export function mapStateToProps(state, { bandId }) {
  const canActiveArtistCreateTrackForBand = Selectors.usm.canActiveArtistCreateTrackForBand(state, bandId);

  return {
    bandId,
    canActiveArtistCreateTrackForBand
  };
}

export const mapDispatchToProps = {
  createTrack: Actions.usm.createTrack,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTrackButton);