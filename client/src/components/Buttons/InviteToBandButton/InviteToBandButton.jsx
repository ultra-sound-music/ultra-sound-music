import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';

export class InviteToBandButton extends React.Component {
  static propTypes = {};

  render() {
    return (
      <Button className='InviteToBandButton' disabled={true}>
        Needs X more members
      </Button>
    );
  }
}

export function mapStateToProps() {
  return {};
}

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InviteToBandButton);
