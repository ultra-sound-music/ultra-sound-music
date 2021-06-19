import React  from 'react';
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import * as Actions from '../redux/actions';

export class Alert extends React.Component {
  static propTypes = {
    shouldShowModal: PropTypes.bool,
    title: PropTypes.string,
    bodyText: PropTypes.string,
    ctaText: PropTypes.string,
    hideModal: PropTypes.func
  };

  onHide = () => {
    if (this.props.title === 'Success!') {
      window.location.reload();
    }
    this.props.hideModal();
  }

  render() {
    return (
      <Modal show={this.props.shouldShowModal} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
      
        <Modal.Body>
          {this.props.bodyText}
        </Modal.Body>
      
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onHide}>Close</Button>
          {this.props.ctaText && <Button variant="primary">{this.props.ctaText}</Button>}
        </Modal.Footer>
      </Modal>
    );    
  }
}

export function mapStateToProps(state) {
  return {
    shouldShowModal: state.modal.shouldShowModal,
    title: state.modal.modalTitle,
    bodyText: state.modal.modalBodyText,
    ctaText: state.modal.modalCTA,
  }
}

const mapDispatchToProps = {
  hideModal: Actions.ui.hideModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Alert);