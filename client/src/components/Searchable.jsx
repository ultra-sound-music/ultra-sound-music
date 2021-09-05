import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Selectors from '../redux/selectors';
import TokenCards from './Tokens/TokenCards';

export class Searchable extends React.Component {
  static propTypes = {
    entityIds: PropTypes.arrayOf(PropTypes.string)
  };

  render() {
    return (
      <div className='Searchable'>
        <TokenCards entityIds={this.props.entityIds} />
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    entityIds: Selectors.usm.selectEntityIds(state)
  };
}

export default connect(mapStateToProps)(Searchable);
