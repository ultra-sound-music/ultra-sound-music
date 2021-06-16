import React from 'react';
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import * as Actions from '../redux/actions';
import * as Selectors from '../redux/selectors';
import CreateArtistButton from '../components/Buttons/CreateArtistButton';
import PlaybackButton from '../components/Buttons/PlaybackButton';

export class Controls extends React.Component {
  static propTypes = {
    showModal: PropTypes.func,
    accountId: PropTypes.string,
  }

  state = {
    name: '',
    description: ''
  }

  getArtistFormData = () => {
    const {
      name,
      description
    } = this.state;

    return {
      name,
      description
    };
  }

  onChangeName = ({ target }) => {
    this.setState({name: target.value});
  }

  onChangeDescription = ({ target }) => {
    this.setState({description: target.value});
  }  

  render() {
    return (
      <div className="Controls">
        <InputGroup className="mb-3">
          <FormControl
            value={this.state.name}
            placeholder="Name"
            onChange={this.onChangeName}
            aria-label="Artist, Band, Track"
            aria-describedby="basic-addon2"            
          />
          <FormControl
            value={this.state.description}
            placeholder="Description"
            onChange={this.onChangeDescription}
            aria-label="Artist, Band, Track"
            aria-describedby="basic-addon2"            
          />          
        </InputGroup>        
        <CreateArtistButton getArtistData={this.getArtistFormData} />
        <PlaybackButton address={this.props.accountId} />
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    accountId: Selectors.web3.getAccountAddress(state)
  }
}

export const mapDispatchToProps = {
  showModal: Actions.showModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);