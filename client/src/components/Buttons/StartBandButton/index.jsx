import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../Button';
import * as Selectors from '../../../redux/selectors';
import * as Actions from '../../../redux/actions';

export class StartBandButton extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    bandLeaderTokenId: PropTypes.number,
    isOwned: PropTypes.bool,
    startBand: PropTypes.func
  }

  onClick = () => {
    const {
      name,
      description,
      bandLeaderTokenId,
      startBand
    } = this.props;

    startBand({
      name,
      description,
      bandLeaderTokenId
    });
  }

  render() {
    return (
      <Button className='StartBandButton' onClick={this.onClick} disabled={!this.props.isOwned}>Start A Band</Button>
    );
  }
}

function mapStateToProps(state, { bandLeaderTokenId }) {
  const isOwned = Selectors.isOwnedToken(state, bandLeaderTokenId);

  return {
    isOwned
  };
}

const mapDispatchToProps = {
  startBand: Actions.usm.startBand
};

export default connect(mapStateToProps, mapDispatchToProps)(StartBandButton);