import React  from 'react';
import NetworkButton from '../Buttons/NetworkButton';

import './Onboarding.scss';

export class Onboarding extends React.Component {
  render() {
    return (
      <div className='Onboarding'>
        <p>Please connect to MetaMask</p>
        <NetworkButton />
      </div>
    );    
  }
}

export default Onboarding;