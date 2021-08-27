import React  from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import StartBandButton from '../../Buttons/StartBandButton';
import PlaybackButton from '../../Buttons/PlaybackButton';
import * as Selectors from '../../../redux/selectors';
import * as Constants from '../../../constants';

export class Token extends React.Component {  
  static propTypes = {
    entityId: PropTypes.string,
    tokenId: PropTypes.number,
    tokenType: PropTypes.string,
    match: PropTypes.object.isRequired
  };

  state = {
    name: '',
    description: ''
  }

  getFormData = () => {
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

  renderInputs() {
    return (
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
    )    
  }
  
  render() {
    const {
      entityId,
      tokenId,
      tokenType,
    } = this.props;

    const {
      name,
      description
    } = this.state;

    let buttons = [];
    if (tokenType === Constants.usm.tokenType.ARTIST) {
      const startBandProps = {
        name,
        description
      };

      buttons = [
        <StartBandButton key='startBand' {...startBandProps} />,
        <PlaybackButton key='playback' entityId={entityId} />
      ]
    } else if (tokenType === Constants.usm.tokenType.BAND) {
      buttons = []
    } else if (tokenType === Constants.usm.tokenType.TRACK) {
      buttons = []
    }

    return (
      <div className='Token'>
        <h1>This is the {tokenType} page</h1>
        <h3>tokenId: {tokenId}</h3>
        <h3>entityId: {this.props.entityId}</h3>
        {this.renderInputs()}

        {buttons}

        <h2>-- artist --</h2>
        <div>- IMAGE</div>
        <div>- NAME</div>
        <div>- DESCRIPTION</div>
        <div>[PLAYBACK]</div>
        <div>[CREATE BAND]</div>
        <div>[INVITE TO JOIN BAND]</div>

        <h2>-- bands --</h2>
        <div>- IMAGE</div>
        <div>- NAME</div>
        <div>- DESCRIPTION</div>
        <div>- BAND MEMBERS</div>
        <div>- LINKS TO OTHER INCARNATIONS OF THE SAME BAND</div>
        <div>[JOIN BAND]</div>
        <div>[REQUEST TO JOIN BAND]</div>
        <div>[PUBLISH TRACK]</div>

        <h2>-- track --</h2>
        <div>- IMAGE</div>
        <div>- NAME</div>
        <div>- DESCRIPTION</div>
        <div>- BAND</div>
        <div>- PUBLISHER (artist who minted the track)</div>
        <div>[PLAYBACK]</div>
      </div>      
    );
  }
}

export function mapStateToProps(state, { match }) {
  const entityId = match?.params?.entityId;
  const tokenId = Selectors.usm.getTokenId(state, entityId)
  const tokenType = Selectors.usm.getTokenType(state, entityId);

  return {
    entityId,
    tokenId,
    tokenType
  };
}

export default withRouter(connect(mapStateToProps)(Token));
