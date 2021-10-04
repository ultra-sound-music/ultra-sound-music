import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import * as Actions from '../redux/actions';
import * as Selectors from '../redux/core/selectors';
import CreateArtistButton from './Buttons/CreateArtistButton';
import StartBandButton from './Buttons/StartBandButton';
import PlaybackButton from './Buttons/PlaybackButton';

export class Controls extends React.Component {
  static propTypes = {
    showModal: PropTypes.func,
    accountId: PropTypes.string,
    hasMintedAnArtist: PropTypes.bool
  };

  state = {
    name: '',
    description: ''
  };

  getInputData = () => {
    const { name, description } = this.state;

    return {
      name,
      description
    };
  };

  onChangeName = ({ target }) => {
    this.setState({ name: target.value });
  };

  onChangeDescription = ({ target }) => {
    this.setState({ description: target.value });
  };

  render() {
    const { name, description } = this.state;

    const buttonProps = {
      name,
      description
    };

    return (
      <div className='Controls'>
        <InputGroup className='mb-3'>
          <FormControl
            value={this.state.name}
            placeholder='Name'
            onChange={this.onChangeName}
            aria-label='Artist, Band, Track'
            aria-describedby='basic-addon2'
          />
          <FormControl
            value={this.state.description}
            placeholder='Description'
            onChange={this.onChangeDescription}
            aria-label='Artist, Band, Track'
            aria-describedby='basic-addon2'
          />
        </InputGroup>
        {this.props.hasMintedAnArtist ? (
          <StartBandButton {...buttonProps} />
        ) : (
          <CreateArtistButton {...buttonProps} />
        )}
        {!this.props.hasMintedAnArtist && (
          <PlaybackButton address={this.props.accountId} />
        )}
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    accountId: Selectors.web3.getAccountAddress(state),
    hasMintedAnArtist: Selectors.hasMintedAnArtist(state)
  };
}

export const mapDispatchToProps = {
  showModal: Actions.ui.showModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
