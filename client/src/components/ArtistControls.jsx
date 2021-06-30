import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import StartBandButton from './Buttons/StartBandButton';

import * as Actions from '../redux/actions'
import * as Selectors from '../redux/selectors';

export class ArtistControls extends React.Component {
  static propTypes = {
    accountId: PropTypes.string,
    entities: PropTypes.array,
    showModal: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.nameRef = React.createRef()
    this.descriptionRef = React.createRef()
  }  

  onClickCreateBand = () => {
    this.createBand();
  }

  // name: PropTypes.string,
  // description: PropTypes.string,
  // bandLeaderTokenId: PropTypes.number,

  render() {
    return (
      <div className='ArtistControls'>
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
        <StartBandButton>Create Band</StartBandButton>
      </div>
    );    
  }
}

export function mapStateToProps(state) {
  const accountAddress = Selectors.web3.getAccountAddress(state);
  const openTransactions = Selectors.web3.selectOpenTransactions(state);
  const isProcessing = openTransactions.some((transaction) => transaction.key === accountAddress);  

  return {
    isProcessing
  }
}

const mapDispatchToProps = {
  showModal: Actions.ui.showModal
};

export default connect(null, mapDispatchToProps)(ArtistControls);