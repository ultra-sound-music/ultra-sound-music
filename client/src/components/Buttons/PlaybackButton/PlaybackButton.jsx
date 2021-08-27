import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Button from 'react-bootstrap/Button';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';

export class PlaybackButton extends React.Component {
  static propTypes = {
    isTokenPlaying: PropTypes.bool,
    address: PropTypes.string,
    entityId: PropTypes.string,
    source: PropTypes.string,
    play: PropTypes.func,
    stop: PropTypes.func
  }

  onClick = () => {
    if (this.props.isTokenPlaying) {
      this.props.stop();
    } else {
      this.props.play({ source: this.props.source });
    }
  }

  renderButtonText() {
    return this.props.isTokenPlaying ? 'stop' : 'play';
  }

  render() {
    return <Button onClick={debounce(this.onClick, 300)}>{this.renderButtonText()}</Button>
  }
}

export function mapStateToProps(state, { entityId, address }) {
  const source = entityId || address;

  return {
    source,
    isTokenPlaying: source && Selectors.playback.selectActiveSource(state) === source,
  };
}

export const mapDispatchToProps = {
  play: Actions.playback.play,
  stop: Actions.playback.stop
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackButton);
