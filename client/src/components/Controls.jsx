// @TODO - Check chainID, if mismatch, then show message

import React from 'react';
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';
import { togglePlayback } from '../audio'
import * as Actions from '../redux/actions';
import * as metaMask from '../utils/metaMask';
import usmAbi from '../lib/usmAbi';
import * as api from '../api';
import * as constants from '../constants';

const BUTTON_WIDTH = "110px"

export class Controls extends React.Component {
  static propTypes = {
    showModal: PropTypes.func,
    accountId: PropTypes.string,
    updateTransactionHash: PropTypes.func
  }
 
  constructor(props) {
    super(props);
    this.nameRef = React.createRef();
    this.descriptionRef = React.createRef();
    this.state = {
      currentPlayState: false,
      currentTrackPlayState: false,
      currentHexAddress: '',
    };
  }

  state = {
    isProcessing: false    
  }

  onClickCreateArtist = () => {
    this.setState({
      isProcessing: true
    });
    this.createArtist();
  }

  async createArtist() {
    const provider = metaMask.getProvider();
    // const contract = new ethers.Contract(constants.CONTRACT_ADDRESS, usmAbi, provider);
    const writeContract = new ethers.Contract(constants.CONTRACT_ADDRESS, usmAbi, provider.getSigner());
    try {
      const { data } = await api.createMetaDataUri({
        name: this.nameRef.current.value || 'NO NAME',
        description: this.descriptionRef.current.value || 'NO DESCRIPTION',
        artistDNA: this.props.accountId
      });
      const tx = await writeContract.createArtist(data.metadataUri);
      this.props.updateTransactionHash(tx);
      this.props.showModal({
        title: 'Success!',
        bodyText: `Your new artist, ${this.nameRef.current.value}, has been created`
      });      
    } catch (error) {
      this.props.showModal({
        title: 'Error',
        bodyText: error
      });
    } finally {
      this.setState({
        isProcessing: false
      });      
    }
  }

  render() {
    const button = this.state.isProcessing ? 
      (
        <Button onClick={this.onClickCreateArtist}>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="sr-only">Processing...</span>
        </Button>          
      )
      : <Button onClick={this.onClickCreateArtist}>Create Artist</Button>



    return (
      <div className="Controls">
        <InputGroup className="mb-3">
          <FormControl
            ref={this.nameRef}
            placeholder="Name"
            aria-label="Artist, Band, Track"
            aria-describedby="basic-addon2"            
          />
          <FormControl
            ref={this.descriptionRef}
            placeholder="Description"
            aria-label="Artist, Band, Track"
            aria-describedby="basic-addon2"            
          />          
        </InputGroup>        
        {button}
        {
          <>
            <Button style={{ width: BUTTON_WIDTH, height: "40px", margin: "8px" }} onClick={async () => {
              this.setState({ currentPlayState: await togglePlayback(this.props.accountId) })
            }}>{this.state.currentPlayState ? 'Stop Artist' : 'Play Artist'}</Button>
          </>
        }
      </div>
    );
  }
}

const mapDispatchToProps = {
  showModal: Actions.showModal
};

export default connect(null, mapDispatchToProps)(Controls);