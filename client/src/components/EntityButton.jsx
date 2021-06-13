import React from 'react';
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'; 
import usmAbi from '../lib/usmAbi';
import { togglePlayback } from '../audio'
import * as metaMask from '../utils/metaMask';
import * as api from '../services'
import * as Actions from '../redux/actions';
import * as entityUtils from '../utils/entities';
import * as constants from '../constants';

import './EntityButton.scss';

const MAX_BAND_MEMBERS = 4;

export class EntityButton extends React.Component {
  static propTypes = {
    currentAccountId: PropTypes.string,
    currentEntityId: PropTypes.string,
    tokenType: PropTypes.string,
    tokenId: PropTypes.number,
    currentAccountArtistId: PropTypes.number,
    isOwned: PropTypes.bool,
    isMember: PropTypes.bool,
    hasAlreadyPublishedTrack: PropTypes.bool,
    numBandMembersNeeded: PropTypes.number,
    showModal: PropTypes.func,
    updateTransactionHash: PropTypes.func,
    addresses: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.nameRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  state = {
    isProcessing: false,
    currentPlayState: false    
  }

  onClickJoinBand = () => {
    this.setState({
      isProcessing: true
    });    
    this.joinBand();
  }

  onClickPublishTrack = () => {
    this.setState({
      isProcessing: true
    });    
    this.publishTrack();
  }

  async joinBand() {
    const {
      currentAccountArtistId, tokenId
    } = this.props;

    // @todo need artistId - however, the current account can have multiple artists to join from
    try {
      const tx = await entityUtils.joinBand(currentAccountArtistId, tokenId);    
      this.props.updateTransactionHash(tx);
      this.props.showModal({
        title: 'Success!',
        bodyText: `You have joined the band!`
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

  async publishTrack() {
    const provider = metaMask.getProvider();
    // const contract = new ethers.Contract(constants.web3.CONTRACT_ADDRESS, usmAbi, provider);
    const writeContract = new ethers.Contract(constants.web3.CONTRACT_ADDRESS, usmAbi, provider.getSigner());
    try {
      const { data } = await api.createMetaDataUri({
        name: this.nameRef.current.value,
        description: this.descriptionRef.current.value
      });
      const tx = await writeContract.createTrack(this.props.currentAccountArtistId, this.props.tokenId, data.metadataUri);
      this.props.updateTransactionHash(tx);
      this.props.showModal({
        title: 'Success!',
        bodyText: `You just published your track: ${this.nameRef.current.value}!`
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
    const {
      hasAlreadyPublishedTrack,
      numBandMembersNeeded,
      tokenType,
      isMember
    } = this.props;

    let ctaText = '';
    let isDisabled = false;
    let onClick = null;
    let buttons = null;

    if (this.state.isProcessing) {
      ctaText = (
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
      );
    } else if (this.props.tokenType === 'track') {
      ctaText = this.state.currentPlayState ? 'Stop' : 'Play';
      onClick= async () => {
        this.setState({currentPlayState: await togglePlayback(this.props.addresses) })
      };
    } else if (tokenType === 'band') {
      if (hasAlreadyPublishedTrack) {
        ctaText = 'Already published track';
        isDisabled = true;
      } else if (isMember && numBandMembersNeeded === 0) {
        buttons = (
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
        )
        onClick = this.onClickPublishTrack;
        ctaText = 'Publish track';
      } else if (isMember && numBandMembersNeeded) {
        ctaText = `Waiting for ${numBandMembersNeeded} to join`;
        isDisabled = true;
      } else {
        ctaText = 'Join band';
        onClick = this.onClickJoinBand;
      }
    }

    const props = {
      variant: 'primary',
      disabled: isDisabled,
      onClick
    };

    if (!ctaText) {
      return null;
    }

    return (
      <div>
        {buttons}
        <Button {...props}>{ctaText}</Button>
      </div>
    );
  }
}

const mapDispatchToProps = {
  showModal: Actions.showModal
};

export default connect(null, mapDispatchToProps)(EntityButton);