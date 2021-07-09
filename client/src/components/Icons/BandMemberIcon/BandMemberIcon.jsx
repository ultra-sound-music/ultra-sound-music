import React  from 'react';
import { connect } from 'react-redux';
import { FilePersonFill, FilePerson } from 'react-bootstrap-icons';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PropTypes from 'prop-types';
import * as Selectors from '../../../redux/selectors';

export class BandMemberIcon extends React.Component {
  static propTypes = {
    artistId: PropTypes.number,
    name: PropTypes.string
  };

  renderTooltip = (props) => {
    return (
      <Tooltip id="button-tooltip" {...props}>
        {this.props.name}
      </Tooltip>
    )
  }

  renderPersonFilled() {
    const triggerProps = {
      placement: "top",
      delay: { show: 200, hide: 400 },
      overlay: this.renderTooltip
    };

    return (
      <OverlayTrigger {...triggerProps} >
        <FilePersonFill />
      </OverlayTrigger>
    );
  }

  renderPerson() {
    <FilePerson />
  }

  render() {
    const { artistId } = this.props; 
    return (
      <div className="BandMemberIcon">        
        {artistId ? this.renderPersonFilled() : this.renderPerson() }
      </div>
    );
  }
}

function mapStateToProps(state, { artistId }) {
  return {
    name: Selectors.usm.getTokenName(state, artistId)
  }
}

export default connect(mapStateToProps)(BandMemberIcon);
