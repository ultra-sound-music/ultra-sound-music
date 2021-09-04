import React  from 'react';
import Spinner from 'react-bootstrap/Spinner';

import './ProcessingIndicator.scss';

export class ProcessingIndicator extends React.Component {
  renderSpinner() {
    return (
      <Spinner
        className="ProcessingIndicator__spinner"
        as="span"
        animation="border"
        role="status"
        aria-hidden="true"
      />
    );
  }

  render() {
    return (
      <div className='ProcessingIndicator'>{this.renderSpinner()} Processing...</div>
    );    
  }
}

export default ProcessingIndicator;