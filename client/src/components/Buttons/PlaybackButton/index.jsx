import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';

export class PlaybackButton extends React.Component {
  static propTypes = {
    isTokenPlaying: PropTypes.bool,
    address: PropTypes.string,
    tokenId: PropTypes.number,
    source: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    play: PropTypes.func,
    stop: PropTypes.func
  }

  state = {
    showAsPlaying: false
  }

  onClick = () => {
    if (this.props.isTokenPlaying) {
      this.setState({showAsPlaying: false});
      this.props.stop();
    } else {
      this.setState({showAsPlaying: true});
      this.props.play({ source: this.props.source });
    }
  }

  // Helps prevent race conditions due to rapid clicking
  isDisabled() {
    return this.props.isTokenPlaying !== this.state.showAsPlaying;
  }

  renderButtonText() {
    return this.props.isTokenPlaying ? 'stop' : 'play';
  }

  render() {
    return <Button onClick={this.onClick} disabled={this.isDisabled()}>{this.renderButtonText()}</Button>
  }
}

export function mapStateToProps(state, { tokenId, address }) {
  const source = tokenId || address
  return {
    source,
    isTokenPlaying: Selectors.playback.selectActiveSource(state) === source,
  };
}

export const mapDispatchToProps = {
  play: Actions.playback.play,
  stop: Actions.playback.stop
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackButton);
